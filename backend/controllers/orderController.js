const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const orderConfirmationTemplate = require('../utils/orderConfirmationTemplate');
const sampleOrderConfirmationTemplate = require('../utils/sampleOrderConfirmationTemplate');

// Helper function to update product stock
const updateStock = async (items, operation) => {
    for (const item of items) {
        const product = await Product.findById(item.product);
        
        if (operation === 'add') {
            // Add stock back when order is cancelled/returned
            product.stock += item.quantity;
        } else if (operation === 'remove') {
            // Remove stock when order is placed
            product.stock -= item.quantity;
        }
        
        // Ensure stock doesn't go below 0
        product.stock = Math.max(0, product.stock);
        
        // Update product stock
        await product.save({ validateBeforeSave: false });
    }
};

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

exports.createRazorpaySampleOrder = asyncErrorHandler(async (req, res, next) => {
    const { amount } = req.body;

    const options = {
        amount: Number(amount) * 100, // Amount in the smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
        return next(new ErrorHandler("Razorpay order creation failed", 500));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

exports.sendRazorpayApiKey = asyncErrorHandler(async (req, res, next) => {
    res.status(200).json({ razorpayApiKey: process.env.RAZORPAY_KEY_ID });
});

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
        totalOrders
    });
});

// --- MODIFICATION: Get Logged In User's Sample Orders ---
exports.mySampleOrders = asyncErrorHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id, isSampleOrder: true };

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
        totalOrders
    });
});

// Get all orders without pagination - Admin
exports.getAllOrdersWithoutPagination = asyncErrorHandler(async (req, res, next) => {
    const query = {};
    
    if (req.query.status) {
        query.orderStatus = req.query.status;
    }
    
    if (req.query.paymentStatus) {
        query.paymentInfo = { status: req.query.paymentStatus };
    }
    
    if (req.query.paymentMethod) {
        query.paymentInfo = { ...query.paymentInfo, paymentMethod: req.query.paymentMethod };
    }
    
    if (req.query.startDate && req.query.endDate) {
        query.createdAt = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
        };
    }

    const orders = await Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// Update order status - Admin
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    const { status, trackingNumber, trackingUrl, consignmentNumber, vrlInvoiceLink } = req.body;

    if (status) {
        order.orderStatus = status;
        
        // If order is being marked as shipped, set shippedAt
        if (status === 'Shipped') {
            order.shippedAt = Date.now();
        }
        
        // If order is being marked as delivered, set deliveredAt
        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }
    }

    // Update tracking information if provided
    if (trackingNumber) {
        order.trackingNumber = trackingNumber;
    }
    
    if (trackingUrl) {
        order.trackingUrl = trackingUrl;
    }

    // Update consignment and VRL link if provided
    if (consignmentNumber) {
        order.consignmentNumber = consignmentNumber;
    }

    if (vrlInvoiceLink) {
        order.vrlInvoiceLink = vrlInvoiceLink;
    }

    await order.save({ validateBeforeSave: false });

    // If order is delivered, update product stock
    if (status === 'Delivered') {
        await updateStock(order.orderItems, 'add');
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Delete order - Admin
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    // If order is not delivered, restore product stock
    if (order.orderStatus !== 'Delivered') {
        await updateStock(order.orderItems, 'add');
    }

    // Remove the order
    await order.remove();

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    });
});

// Get all orders with pagination - Admin
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    if (req.query.status) {
        query.orderStatus = req.query.status;
    }
    
    if (req.query.paymentStatus) {
        query.paymentInfo = { status: req.query.paymentStatus };
    }
    
    if (req.query.paymentMethod) {
        query.paymentInfo = { ...query.paymentInfo, paymentMethod: req.query.paymentMethod };
    }
    
    if (req.query.startDate && req.query.endDate) {
        query.createdAt = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
        };
    }

    const orders = await Order.find(query)
        .populate('user', 'name email')
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
        totalOrders
    });
});

// Get user's recent orders with tracking information
exports.getRecentOrders = asyncErrorHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit, 10) || 5;
    const days = parseInt(req.query.days, 10) || 30;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const orders = await Order.find({
        user: req.user._id,
        createdAt: { $gte: startDate },
        orderStatus: { $ne: 'Cancelled' }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('_id orderStatus totalPrice createdAt trackingEvents orderItems.name orderItems.image consignmentNumber');
    
    res.status(200).json({
        success: true,
        orders
    });
});

// Add tracking event to an order
exports.addTrackingEvent = asyncErrorHandler(async (req, res, next) => {
    const { status, location, description } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }
    
    // Validate status
    const validStatuses = ['Order Placed', 'Processing', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return next(new ErrorHandler('Invalid status', 400));
    }
    
    const trackingEvent = {
        status,
        location: location || '',
        description: description || `${status} - ${new Date().toLocaleString()}`,
        timestamp: new Date()
    };
    
    // Update order status if this is a status change
    if (status !== 'Order Placed') {
        order.orderStatus = status;
    }
    
    // Add to tracking events
    order.trackingEvents.push(trackingEvent);
    await order.save();
    
    // Emit socket event for real-time updates
    const io = req.app.get('socketio');
    if (io) {
        io.to(`order_${order._id}`).emit('tracking_updated', {
            orderId: order._id,
            event: trackingEvent
        });
    }
    
    res.status(200).json({
        success: true,
        trackingEvent
    });
});

// Get user's recent orders with tracking info
exports.getUserRecentOrders = asyncErrorHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit, 10) || 5; // Default to 5 most recent orders
    const days = parseInt(req.query.days, 10) || 30; // Default to last 30 days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const orders = await Order.find({
        user: req.user._id,
        createdAt: { $gte: startDate },
        orderStatus: { $ne: 'Cancelled' }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('_id orderStatus totalPrice createdAt trackingEvents orderItems.name orderItems.image consignmentNumber');
    
    res.status(200).json({
        success: true,
        orders
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
    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }
    await order.remove(); // Note: .remove() is deprecated in Mongoose 6+. Use .deleteOne() or .findByIdAndDelete()
    res.status(200).json({
        success: true,
    });
});

// Update VRL Invoice Link and Consignment Number
exports.updateShippingDetails = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    const { vrlInvoiceLink, consignmentNumber } = req.body;

    if (vrlInvoiceLink) {
        order.vrlInvoiceLink = vrlInvoiceLink;
    }

    if (consignmentNumber) {
        order.consignmentNumber = consignmentNumber;
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order,
    });
});

// Get Order Shipping Details
exports.getOrderShippingDetails = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id, 'vrlInvoiceLink consignmentNumber shippingInfo');

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        shippingDetails: {
            vrlInvoiceLink: order.vrlInvoiceLink,
            consignmentNumber: order.consignmentNumber,
            shippingAddress: order.shippingInfo
        }
    });
});