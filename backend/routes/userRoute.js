console.log('👤 userRoute.js loaded');
const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const router = express.Router();

// ─── Regular Auth Routes ─────────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// ─── User Profile / Password ─────────────────────────────────────────────
router.get('/me', isAuthenticatedUser, getUserDetails);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.put('/me/update', isAuthenticatedUser, updateProfile);

// ─── Admin-Only Routes ───────────────────────────────────────────────────
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router
  .route('/admin/user/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;
