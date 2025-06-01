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
const passport = require('passport');

const router = express.Router();

// Google OAuth: Start authentication
router.get('/auth/google', (req, res, next) => {
    const redirect = req.query.redirect || 'account';
    const state = JSON.stringify({ redirect });
    const authenticator = passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: state
    });
    authenticator(req, res, next);
});

// Google OAuth: Callback
router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'https://dhagakart-jfaj.vercel.app/login',
        session: false
    }),
    async (req, res) => {
        try {
            // Extract redirect path from state
            const state = JSON.parse(req.query.state || '{}');
            const redirectPath = state.redirect || 'account';

            // Generate JWT token
            const token = req.user.getJWTToken();

            // Set token in cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            });

            // Redirect to frontend with path
            const redirectUrl = `https://dhagakart-jfaj.vercel.app/${redirectPath}`.replace(/\/+$/, '');
            res.redirect(redirectUrl);
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect('https://dhagakart-jfaj.vercel.app/login?error=auth_failed');
        }
    }
);

// Auth routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

// User info and password
router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

// Admin routes
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
