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

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://dhagakart-jfaj.vercel.app';
// const FRONTEND_URL = 'http://localhost:5173';

// ─── 1. START Google OAuth Flow ────────────────────────────────────────
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// ─── Google OAuth Callback ────────────────────────────────────────────────
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
      failureRedirect: `${FRONTEND_URL}/login`,
      session: false
  }),
  async (req, res) => {
      try {
          // Set default redirect
          const redirectUrl = `${FRONTEND_URL}/account` || 'https://dhagakart-jfaj.vercel.app/account';
          // const redirectUrl = 'http://localhost:5173/oauth-success';

          // Generate JWT token
          const token = req.user.getJWTToken();

          // Set token in a cookie
          res.cookie('token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          });

          // Redirect to frontend
          res.redirect(redirectUrl);
      } catch (error) {
          console.error('OAuth callback error:', error);
          res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
          // res.redirect('http://localhost:5173/login?error=auth_failed');
      }
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
