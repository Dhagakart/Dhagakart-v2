const express = require('express');
const {
    getAllProducts,
    getProductDetails,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview,
    getAdminProducts
} = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// --- Public Routes ---
router.route('/products').get(getAllProducts);
router.route('/product/:id').get(getProductDetails);
router.route('/products/all').get(getAllProducts); // Serves all products without filters

// --- User Authenticated Routes ---
router.route('/review').put(isAuthenticatedUser, createProductReview);

// --- Admin Only Routes ---
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route('/admin/reviews')
    .get(isAuthenticatedUser, authorizeRoles("admin"), getProductReviews)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

module.exports = router;