const express = require('express');
const { processPayment, paytmResponse, getPaymentStatus } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and management
 * 
 * components:
 *   schemas:
 *     PaymentRequest:
 *       type: object
 *       required:
 *         - amount
 *         - orderId
 *         - customerId
 *       properties:
 *         amount:
 *           type: number
 *           description: Payment amount in smallest currency unit (e.g., paise for INR)
 *         orderId:
 *           type: string
 *           description: Order ID for which payment is being made
 *         customerId:
 *           type: string
 *           description: ID of the customer making the payment
 *         email:
 *           type: string
 *           format: email
 *           description: Customer email for payment receipt
 *         phone:
 *           type: string
 *           description: Customer phone number
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         orderId:
 *           type: string
 *         txnToken:
 *           type: string
 *           description: Token for payment processing
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *           default: "INR"
 *     PaymentStatusResponse:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *         txnId:
 *           type: string
 *         txnAmount:
 *           type: string
 *         paymentMode:
 *           type: string
 *         currency:
 *           type: string
 *         txnDate:
 *           type: string
 *           format: date-time
 *         responseCode:
 *           type: string
 *         responseMsg:
 *           type: string
 *         status:
 *           type: string
 *           enum: [TXN_SUCCESS, TXN_FAILURE, PENDING, CANCELLED]
 *         bankTxnId:
 *           type: string
 *         bankName:
 *           type: string
 *         paymentMode:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/payment/process:
 *   post:
 *     summary: Initiate payment process
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Invalid payment request
 *       500:
 *         description: Payment processing error
 */
router.route('/payment/process').post(processPayment);
// router.route('/stripeapikey').get(isAuthenticatedUser, sendStripeApiKey);

/**
 * @swagger
 * /api/v1/callback:
 *   post:
 *     summary: Payment gateway callback (Internal use only)
 *     tags: [Payments]
 *     description: This endpoint is called by the payment gateway with transaction status updates
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               ORDERID:
 *                 type: string
 *               TXNID:
 *                 type: string
 *               TXNAMOUNT:
 *                 type: string
 *               PAYMENTMODE:
 *                 type: string
 *               TXNDATE:
 *                 type: string
 *               RESPCODE:
 *                 type: string
 *               STATUS:
 *                 type: string
 *               BANKTXNID:
 *                 type: string
 *               BANKNAME:
 *                 type: string
 *               CHECKSUMHASH:
 *                 type: string
 *     responses:
 *       200:
 *         description: Callback processed successfully
 *       400:
 *         description: Invalid callback data
 */
router.route('/callback').post(paytmResponse);

/**
 * @swagger
 * /api/v1/payment/status/{orderId}:
 *   get:
 *     summary: Get payment status for an order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to check payment status for
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentStatusResponse'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error retrieving payment status
 */
router.route('/payment/status/:id').get(isAuthenticatedUser, getPaymentStatus);

module.exports = router;