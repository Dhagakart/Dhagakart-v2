const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const orderConfirmationTemplate = require('../utils/orderConfirmationTemplate');
const sampleOrderConfirmationTemplate = require('../utils/sampleOrderConfirmationTemplate');

// --- Create New Regular Order ---
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
    const io = req.app.get('socketio');

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

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
            name: 'unit', minQty: 1, increment: 1, isDefault: true, price: item.price, cuttedPrice: item.cuttedPrice
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
        isSampleOrder: false, // MODIFICATION: Explicitly set for regular orders
    });

    try {
        const orderDataForEmail = order.toObject();
        const emailHtml = orderConfirmationTemplate(orderDataForEmail);

        if (emailHtml && emailHtml.length > 100) {
            await sendEmail({
                email: req.user.email,
                subject: `Your DhagaKart Order #${order._id} is Confirmed!`,
                html: emailHtml,
            });
        }
    } catch (emailError) {
        console.error(`EMAIL FAILED TO SEND for order ${order._id}:`, emailError);
    }
    
    try {
        if (io) {
            io.emit("newOrder", order);
        }
    } catch (error) {
        console.error(`Socket.io failed to emit for order ${order._id}:`, error);
    }

    res.status(201).json({
        success: true,
        order,
    });
});

// --- MODIFICATION: Create New Sample Order ---
exports.newSampleOrder = asyncErrorHandler(async (req, res, next) => {
    const io = req.app.get('socketio');

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

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
            name: 'unit', minQty: 1, increment: 1, isDefault: true, price: item.price, cuttedPrice: item.cuttedPrice
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
        isSampleOrder: true, // This is the key difference
    });

    try {
        const orderDataForEmail = order.toObject();
        const emailHtml = sampleOrderConfirmationTemplate(orderDataForEmail);

        if (emailHtml && emailHtml.length > 100) {
            await sendEmail({
                email: req.user.email,
                subject: `Your DhagaKart Sample Order #${order._id} is Confirmed!`,
                html: emailHtml,
            });
        }
    } catch (emailError) {
        console.error(`EMAIL FAILED TO SEND for sample order ${order._id}:`, emailError);
    }
    
    try {
        if (io) {
            io.emit("newOrder", order); // You might want a different event like "newSampleOrder"
        }
    } catch (error) {
        console.error(`Socket.io failed to emit for sample order ${order._id}:`, error);
    }

    res.status(201).json({
        success: true,
        order,
    });
});

// --- Get Single Order Details (Works for both types) ---
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

// --- Get Logged In User's Regular Orders ---
exports.myOrders = asyncErrorHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id, isSampleOrder: false }; // MODIFICATION: Filter for regular orders

    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
        success: true,
        orders,
        currentPage: page,
        totalPages,
        totalOrders,
    });
});

// --- MODIFICATION: Get Logged In User's Sample Orders ---
exports.mySampleOrders = asyncErrorHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id, isSampleOrder: true }; // Filter for sample orders

    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
        success: true,
        orders,
        currentPage: page,
        totalPages,
        totalOrders,
    });
});


// --- Get All Orders (Admin) ---
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || '-createdAt';
    
    const query = {};
    // MODIFICATION: Add filter for sample/regular orders
    if (req.query.isSampleOrder === 'true') {
        query.isSampleOrder = true;
    } else if (req.query.isSampleOrder === 'false') {
        query.isSampleOrder = false;
    }

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

// --- Update Order Status (Admin - Works for both types) ---
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Already Delivered", 400));
    }

    // Don't update stock for sample orders
    if (req.body.status === "Shipped" && !order.isSampleOrder) {
        order.orderItems.forEach(async (i) => {
            await updateStock(i.product, i.quantity)
        });
    }
    
    order.shippedAt = req.body.status === "Shipped" ? Date.now() : order.shippedAt;
    order.orderStatus = req.body.status;
    order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

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

// --- Get All Orders Without Pagination (Admin) ---
exports.getAllOrdersWithoutPagination = asyncErrorHandler(async (req, res, next) => {
    const query = {};
    // MODIFICATION: Add filter for sample/regular orders
    if (req.query.isSampleOrder === 'true') {
        query.isSampleOrder = true;
    } else if (req.query.isSampleOrder === 'false') {
        query.isSampleOrder = false;
    }

    const orders = await Order.find(query)
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
});

// --- Search Orders (Admin) ---
exports.searchOrders = asyncErrorHandler(async (req, res, next) => {
    const {
        orderId, customerName, customerEmail, productName, minAmount,
        maxAmount, status, startDate, endDate, paymentMethod,
        isSampleOrder, // MODIFICATION: Added filter
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

    // MODIFICATION: Add filter for sample/regular orders
    if (isSampleOrder === 'true') {
        query.isSampleOrder = true;
    } else if (isSampleOrder === 'false') {
        query.isSampleOrder = false;
    }

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

// --- Delete Order (Admin - Works for both types) ---
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }
    await order.remove(); // Note: .remove() is deprecated in Mongoose 6+. Use .deleteOne() or .findByIdAndDelete()
    res.status(200).json({
        success: true,
    });
});