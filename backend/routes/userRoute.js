const express = require('express');
const passport = require('passport');
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
const sendToken = require('../utils/sendToken');

const router = express.Router();

const FRONTEND_URL = 'https://dhagakart-jfaj.vercel.app';

// ─── 1. START Google OAuth Flow ────────────────────────────────────────
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// ─── Google OAuth Callback ────────────────────────────────────────────────
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/login`,
    session: true
  }),
  (req, res) => {
    // Use your custom sendToken function
    sendToken(req.user, 200, res);

    // Redirect to account page after setting cookie
    res.redirect(`${FRONTEND_URL}/account`);
  }
);

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
