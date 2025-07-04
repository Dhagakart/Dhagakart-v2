const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');

// Create New Order
// In orderController.js
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderStatus,
      paidAt,
      createdAt
    } = req.body;
  
    // Remove the duplicate check if you want to allow multiple mock orders
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: paidAt || Date.now(),
      orderStatus: orderStatus || 'Processing',
      createdAt: createdAt || Date.now(),
      user: req.user._id,
    });
  
    // Optional: Keep or remove the email sending logic
    await sendEmail({
      email: req.user.email,
      templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
      data: {
        name: req.user.name,
        shippingInfo,
        orderItems,
        totalPrice,
        oid: order._id,
      }
    });
  
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
    const limit = 10; // 10 orders per page
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
// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortBy = req.query.sortBy || '-createdAt';
    
    // Build query
    const query = {};
    
    // Execute query with pagination and sorting
    const [orders, totalOrders] = await Promise.all([
        Order.find(query)
            .sort(sortBy)
            .limit(limit)
            .skip(skip)
            .populate('user', 'name email'),
        Order.countDocuments(query)
    ]);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / limit);
    
    // Calculate total amount for all orders (for backward compatibility)
    const totalAmount = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    
    // Log the response for debugging
    console.log('Sending orders response:', {
        ordersCount: orders.length,
        totalOrders,
        totalPages,
        currentPage: page,
        totalAmount
    });

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
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// Get All Orders Without Pagination --- ADMIN
exports.getAllOrdersWithoutPagination = asyncErrorHandler(async (req, res, next) => {
    try {
        // Get all orders with user details populated
        const orders = await Order.find()
            .sort('-createdAt')
            .populate('user', 'name email');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return next(new ErrorHandler('Error fetching all orders', 500));
    }
});

// Search Orders with Filters ---ADMIN
exports.searchOrders = asyncErrorHandler(async (req, res, next) => {
    console.log('Search request received with query:', req.query);
    
    const {
        orderId,
        customerName,
        customerEmail,
        productName,
        minAmount,
        maxAmount,
        status,
        startDate,
        endDate,
        paymentMethod,
        sortBy = '-createdAt',
        page = 1,
        limit = 10
    } = req.query;

    const query = {};

    // Filter by order ID
    if (orderId) {
        query._id = orderId;
    }

    // Filter by customer name (case-insensitive)
    if (customerName) {
        query['shippingInfo.name'] = { $regex: customerName, $options: 'i' };
    }

    // Filter by customer email (case-insensitive)
    if (customerEmail) {
        query['user.email'] = { $regex: customerEmail, $options: 'i' };
    }

    // Filter by product name in order items
    if (productName) {
        query['orderItems.name'] = { $regex: productName, $options: 'i' };
    }

    // Filter by order amount range
    if (minAmount || maxAmount) {
        query.totalPrice = {};
        if (minAmount) query.totalPrice.$gte = Number(minAmount);
        if (maxAmount) query.totalPrice.$lte = Number(maxAmount);
    }

    // Filter by order status
    if (status) {
        query.orderStatus = status;
    }

    // Filter by date range
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // End of the day
            query.createdAt.$lte = end;
        }
    }

    // Filter by payment method
    if (paymentMethod) {
        query.paymentInfo.type = paymentMethod;
    }

    // Pagination
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * limit;

    console.log('MongoDB query:', JSON.stringify(query, null, 2));
    console.log('Pagination:', { page, limit, skip, sortBy });
    
    // Execute query with pagination
    const orders = await Order.find(query)
        .sort(sortBy)
        .limit(Number(limit))
        .skip(Number(skip))
        .populate('user', 'name email');

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);
    
    console.log(`Found ${orders.length} orders out of ${totalOrders} total`);

    const response = {
        success: true,
        orders,
        currentPage: Number(page),
        totalPages: Math.ceil(totalOrders / Number(limit)),
        totalOrders
    };
    
    console.log('Sending response:', JSON.stringify({
        ...response,
        orders: `[${response.orders.length} orders]`
    }, null, 2));
    
    res.status(200).json(response);
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