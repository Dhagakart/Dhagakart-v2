const express = require('express');
const { searchProducts } = require('../controllers/searchController');

const router = express.Router();

/**
 * @swagger
 * /search/suggestions:
 *   get:
 *     summary: Get search suggestions for products
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of search suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 */
router.get('/suggestions', searchProducts);

module.exports = router;
