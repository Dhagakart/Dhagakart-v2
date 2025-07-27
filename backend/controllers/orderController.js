const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const orderConfirmationTemplate = require('../utils/orderConfirmationTemplate');

// Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
    // Get the io instance from the request's app object
    const io = req.app.get('socketio');

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    // Process order items to ensure they include unit information
    const processedOrderItems = orderItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        product: item.product,
        unit: item.unit ? {
            name: item.unit.name || item.unit.unit || 'unit',
            minQty: item.unit.minQty || 1,
            maxQty: item.unit.maxQty,
            increment: item.unit.increment || 1,
            isDefault: item.unit.isDefault || false,
            price: item.unit.price || item.price,
            cuttedPrice: item.unit.cuttedPrice || item.cuttedPrice
        } : {
            name: 'unit',
            minQty: 1,
            increment: 1,
            isDefault: true,
            price: item.price,
            cuttedPrice: item.cuttedPrice
        }
    }));

    const order = await Order.create({
        shippingInfo,
        orderItems: processedOrderItems,
        paymentInfo,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    // --- Send Order Confirmation Email ---
    try {
        const orderDataForEmail = order.toObject();
        const emailHtml = orderConfirmationTemplate(orderDataForEmail);

        if (emailHtml && emailHtml.length > 100) {
            await sendEmail({
                email: req.user.email,
                subject: `Your DhagaKart Order #${order._id} is Confirmed!`,
                html: emailHtml,
            });
            console.log(`Order confirmation email sent successfully to ${req.user.email}`);
        }
    } catch (emailError) {
        console.error(`EMAIL FAILED TO SEND for order ${order._id}:`, emailError);
    }

    // --- EMIT NEW ORDER EVENT ---
    try {
        if (io) {
            io.emit("newOrder", order);
            console.log(`Socket.io event "newOrder" emitted for Order ID: ${order._id}`);
        } else {
            console.error("Socket.io instance not found on req.app.get('socketio').");
        }
    } catch (error) {
        console.error(`Socket.io failed to emit for order ${order._id}:`, error);
    }

    res.status(201).json({
        success: true,
        order,
    });
});

// Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
});

// Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalOrders = await Order.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalOrders / limit);

    if (!orders) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        orders,
        currentPage: page,
        totalPages,
        totalOrders,
    });
});

// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || '-createdAt';
    const query = {};

    const [orders, totalOrders] = await Promise.all([
        Order.find(query)
            .sort(sortBy)
            .limit(limit)
            .skip(skip)
            .populate('user', 'name email'),
        Order.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalOrders / limit);
    const totalAmount = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    res.status(200).json({
        success: true,
        orders,
        totalAmount,
        pagination: {
            totalOrders,
            totalPages,
            currentPage: page,
            limit
        }
    });
});

// Update Order Status ---ADMIN
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Already Delivered", 400));
    }
    if (req.body.status === "Shipped") {
        order.shippedAt = Date.now();
        order.orderItems.forEach(async (i) => {
            await updateStock(i.product, i.quantity)
        });
    }
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    if(product) {
        product.stock -= quantity;
        await product.save({ validateBeforeSave: false });
    }
}

// Get All Orders Without Pagination --- ADMIN
exports.getAllOrdersWithoutPagination = asyncErrorHandler(async (req, res, next) => {
    try {
        const orders = await Order.find()
            .sort('-createdAt')
            .populate('user', 'name email')
            .lean();
        const totalAmount = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const totalOrders = orders.length;
        res.status(200).json({
            success: true,
            orders: orders,
            totalOrders: totalOrders,
            totalAmount: totalAmount,
            count: totalOrders
        });
    } catch (error) {
        console.error('Error in getAllOrdersWithoutPagination:', error);
        return next(new ErrorHandler('Error fetching all orders: ' + error.message, 500));
    }
});

// Search Orders with Filters ---ADMIN
exports.searchOrders = asyncErrorHandler(async (req, res, next) => {
    const {
        orderId, customerName, customerEmail, productName, minAmount,
        maxAmount, status, startDate, endDate, paymentMethod,
        sortBy = '-createdAt', page = 1, limit = 10
    } = req.query;

    const query = {};
    if (orderId) query._id = orderId;
    if (customerName) query['shippingInfo.name'] = { $regex: customerName, $options: 'i' };
    if (customerEmail) query['user.email'] = { $regex: customerEmail, $options: 'i' };
    if (productName) query['orderItems.name'] = { $regex: productName, $options: 'i' };
    if (minAmount || maxAmount) {
        query.totalPrice = {};
        if (minAmount) query.totalPrice.$gte = Number(minAmount);
        if (maxAmount) query.totalPrice.$lte = Number(maxAmount);
    }
    if (status) query.orderStatus = status;
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query.createdAt.$lte = end;
        }
    }
    if (paymentMethod) query.paymentInfo.type = paymentMethod;

    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * limit;

    const orders = await Order.find(query)
        .sort(sortBy)
        .limit(Number(limit))
        .skip(Number(skip))
        .populate('user', 'name email');

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
        success: true,
        orders,
        currentPage: Number(page),
        totalPages: Math.ceil(totalOrders / Number(limit)),
        totalOrders
    });
});

// Delete Order ---ADMIN
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }
    await order.remove();
    res.status(200).json({
        success: true,
    });
});
