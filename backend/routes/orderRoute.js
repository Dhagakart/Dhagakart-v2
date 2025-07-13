const express = require('express');
const { newOrder, getSingleOrderDetails, myOrders, getAllOrders, updateOrder, deleteOrder, searchOrders, getAllOrdersWithoutPagination } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and tracking
 * 
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: integer
 *         image:
 *           type: string
 *         product:
 *           type: string
 *           format: ObjectId
 *     ShippingInfo:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country:
 *           type: string
 *         pinCode:
 *           type: string
 *         phoneNo:
 *           type: string
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingInfo:
 *           $ref: '#/components/schemas/ShippingInfo'
 *         user:
 *           type: string
 *           format: ObjectId
 *         paymentInfo:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             status:
 *               type: string
 *         paidAt:
 *           type: string
 *           format: date-time
 *         itemsPrice:
 *           type: number
 *         taxPrice:
 *           type: number
 *         shippingPrice:
 *           type: number
 *         totalPrice:
 *           type: number
 *         orderStatus:
 *           type: string
 *           enum: [Processing, Shipped, Delivered, Cancelled]
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - orderItems
 *         - shippingInfo
 *         - paymentInfo
 *         - shippingPrice
 *         - totalPrice
 *       properties:
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingInfo:
 *           $ref: '#/components/schemas/ShippingInfo'
 *         paymentInfo:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             status:
 *               type: string
 *         itemsPrice:
 *           type: number
 *         taxPrice:
 *           type: number
 *         shippingPrice:
 *           type: number
 *         totalPrice:
 *           type: number
 *     UpdateOrderStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [Processing, Shipped, Delivered, Cancelled]
 */

/**
 * @swagger
 * /api/v1/order/new:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order data
 */
router.route('/order/new').post(isAuthenticatedUser, newOrder);

/**
 * @swagger
 * /api/v1/order/{id}:
 *   get:
 *     summary: Get single order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrderDetails);

/**
 * @swagger
 * /api/v1/orders/me:
 *   get:
 *     summary: Get logged in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

/**
 * @swagger
 * /api/v1/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Orders per page
 *     responses:
 *       200:
 *         description: List of all orders with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

/**
 * @swagger
 * /api/v1/admin/orders/search:
 *   get:
 *     summary: Search orders with filters (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         description: Filter by order ID
 *       - in: query
 *         name: customerName
 *         schema:
 *           type: string
 *         description: Filter by customer name (case-insensitive)
 *       - in: query
 *         name: customerEmail
 *         schema:
 *           type: string
 *         description: Filter by customer email (case-insensitive)
 *       - in: query
 *         name: productName
 *         schema:
 *           type: string
 *         description: Filter by product name in order items (case-insensitive)
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *         description: Filter by minimum order amount
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *         description: Filter by maximum order amount
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by order status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (YYYY-MM-DD)
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *         description: Filter by payment method
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort field with prefix - for descending (e.g., -createdAt)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of filtered orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalOrders:
 *                   type: integer
 */
router.route('/admin/orders/search').get(isAuthenticatedUser, authorizeRoles('admin'), searchOrders);

/**
 * @swagger
 * /api/v1/admin/orders/all:
 *   get:
 *     summary: Get all orders without pagination (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.route('/admin/orders/all').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrdersWithoutPagination);

/**
 * @swagger
 * /api/v1/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Orders per page
 *     responses:
 *       200:
 *         description: List of all orders with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

/**
 * @swagger
 * /api/v1/admin/order/{id}:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *   delete:
 *     summary: Delete an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
// Admin routes
router.route('/admin/orders')
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router.route('/admin/orders/all')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrdersWithoutPagination);

router.route('/admin/orders/search')
    .get(isAuthenticatedUser, authorizeRoles('admin'), searchOrders);

router.route('/admin/order/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;