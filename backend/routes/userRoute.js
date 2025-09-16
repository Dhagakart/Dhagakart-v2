// In userRoute.js

console.log('👤 userRoute.js loaded');
const express = require('express');
const {
    // ... all your controller imports
    registerUser, loginUser, logoutUser, getUserDetails, forgotPassword, resetPassword,
    updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser,
    addBillingAddress, updateBillingAddress, deleteBillingAddress,
    addShippingAddress, updateShippingAddress, deleteShippingAddress
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const router = express.Router();

// --- NOTE: All '/users' prefixes have been removed from the routes below ---

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', isAuthenticatedUser, getUserDetails);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.put('/me/update', isAuthenticatedUser, updateProfile);
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

// --- Billing Address Routes ---
const setBillingAddressType = (req, res, next) => {
    req.addressTypeKey = 'billingAddresses';
    next();
};
router.route('/me/address/billing') // Corrected: removed '/users'
    .post(isAuthenticatedUser, setBillingAddressType, addBillingAddress);
router.route('/me/address/billing/:id') // Corrected: removed '/users'
    .put(isAuthenticatedUser, setBillingAddressType, updateBillingAddress)
    .delete(isAuthenticatedUser, setBillingAddressType, deleteBillingAddress);

// --- Shipping Address Routes ---
const setShippingAddressType = (req, res, next) => {
    req.addressTypeKey = 'shippingAddresses';
    next();
};
router.route('/me/address/shipping') // Corrected: removed '/users'
    .post(isAuthenticatedUser, setShippingAddressType, addShippingAddress);
router.route('/me/address/shipping/:id') // Corrected: removed '/users'
    .put(isAuthenticatedUser, setShippingAddressType, updateShippingAddress)
    .delete(isAuthenticatedUser, setShippingAddressType, deleteShippingAddress);

module.exports = router;