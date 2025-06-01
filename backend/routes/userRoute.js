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

const router = express.Router();

// ─── 1. START Google OAuth Flow ────────────────────────────────────────
router.get('/auth/google', (req, res, next) => {
  // You can pass a "redirect" path via query (optional)
  const redirect = req.query.redirect || 'account';
  const state = JSON.stringify({ redirect });

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state
  })(req, res, next);
});

// ─── 2. Google OAuth CALLBACK ────────────────────────────────────────────
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://dhagakart-jfaj.vercel.app/login',
    session: false
  }),
  async (req, res) => {
    try {
      // If you passed a "redirect" in state, read it; otherwise default to '/account'
      const rawState = req.query.state || '{}';
      const parsed = JSON.parse(decodeURIComponent(rawState));
      let redirectPath = parsed.redirect || '/account';

      // Ensure it starts with "/"
      if (!redirectPath.startsWith('/')) {
        redirectPath = '/' + redirectPath;
      }

      // Generate a JWT for this user
      const token = req.user.getJWTToken();

      // Set the cookie in the response
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      // Redirect back to your frontend
      return res.redirect(`https://dhagakart-jfaj.vercel.app${redirectPath}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect('https://dhagakart-jfaj.vercel.app/login?error=auth_failed');
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
