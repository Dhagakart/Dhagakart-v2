const express = require('express');
const { 
    createQuote, 
    getMyQuotes, 
    getSingleQuote, 
    getAllQuotes, 
    updateQuoteStatus, 
    deleteQuote 
} = require('../controllers/quoteController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// Configure express to handle larger payloads
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ extended: true, limit: '50mb' }));

/**
 * @swagger
 * tags:
 *   name: Quotes
 *   description: Quote request management
 * 
 * components:
 *   schemas:
 *     QuoteItem:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         quantity:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [kg, g, L, mL, pcs, boxes, cartons, other]
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *     Quote:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *           format: ObjectId
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuoteItem'
 *         status:
 *           type: string
 *           enum: [pending, processing, quoted, rejected, completed]
 *           default: pending
 *         notes:
 *           type: string
 *         quotedPrice:
 *           type: number
 *         quotedBy:
 *           type: string
 *           format: ObjectId
 *         quotedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateQuoteRequest:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuoteItem'
 *         notes:
 *           type: string
 *     UpdateQuoteStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, processing, quoted, rejected, completed]
 *         quotedPrice:
 *           type: number
 *         notes:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/quotes/new:
 *   post:
 *     summary: Create a new quote request
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuoteRequest'
 *     responses:
 *       201:
 *         description: Quote request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       400:
 *         description: Invalid quote data
 */
router.post('/new', isAuthenticatedUser, createQuote);

/**
 * @swagger
 * /api/v1/quotes/me:
 *   get:
 *     summary: Get current user's quote requests
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, quoted, rejected, completed]
 *         description: Filter quotes by status
 *     responses:
 *       200:
 *         description: List of user's quote requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quote'
 */
router.get('/me', isAuthenticatedUser, getMyQuotes);

/**
 * @swagger
 * /api/v1/quotes/{id}:
 *   get:
 *     summary: Get single quote request by ID
 *     tags: [Quotes]
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
 *         description: Quote request details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       403:
 *         description: Not authorized to access this quote
 *       404:
 *         description: Quote not found
 */
router.get('/:id', isAuthenticatedUser, getSingleQuote);

/**
 * @swagger
 * /api/v1/quotes/admin/all:
 *   get:
 *     summary: Get all quote requests (Admin only)
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, quoted, rejected, completed]
 *         description: Filter quotes by status
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter quotes by user ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, -createdAt, updatedAt, -updatedAt]
 *           default: -createdAt
 *         description: Sort order
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of quotes per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Paginated list of all quote requests
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
 *                     $ref: '#/components/schemas/Quote'
 */
router.get(
    '/admin/all', 
    isAuthenticatedUser, 
    authorizeRoles('admin'), 
    getAllQuotes
);

/**
 * @swagger
 * /api/v1/quotes/admin/status/{id}:
 *   put:
 *     summary: Update quote status (Admin only)
 *     tags: [Quotes]
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
 *             $ref: '#/components/schemas/UpdateQuoteStatusRequest'
 *     responses:
 *       200:
 *         description: Quote status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       400:
 *         description: Invalid status update
 *       404:
 *         description: Quote not found
 */
router.put(
    '/admin/status/:id', 
    isAuthenticatedUser, 
    authorizeRoles('admin'), 
    updateQuoteStatus
);

/**
 * @swagger
 * /api/v1/quotes/admin/{id}:
 *   delete:
 *     summary: Delete a quote request (Admin only)
 *     tags: [Quotes]
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
 *         description: Quote deleted successfully
 *       404:
 *         description: Quote not found
 */
router.delete(
    '/admin/:id', 
    isAuthenticatedUser, 
    authorizeRoles('admin'), 
    deleteQuote
);

module.exports = router;