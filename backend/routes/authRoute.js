// routes/authRoute.js
console.log('🔐 authRoute.js loaded');
const express = require('express');
const passport = require('passport');
const User = require('../models/userModel');
const sendToken = require('../utils/sendToken');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         avatar:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *             url:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     description: Redirects to Google OAuth consent screen
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 *       500:
 *         description: Server error
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile','email'],
  })
);

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback URL
 *     tags: [Authentication]
 *     description: Callback URL for Google OAuth. Not meant to be called directly.
 *     responses:
 *       302:
 *         description: Redirects to frontend with token
 *       400:
 *         description: Authentication failed
 *       500:
 *         description: Server error
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res, next) => {
    try {
      const { displayName: name, emails } = req.user;
      const email = emails[0].value;

      let user = await User.findOne({ email });
      if (user) { return sendToken(user, 200, res, `${process.env.FRONTEND_URL}/`); }
      // if (user) { return sendToken(user, 200, res, `http://localhost:5173/account`); }

      // Instead of session, redirect with data in query params
      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-complete-registration?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
      // const redirectUrl = `http://localhost:5173/oauth-complete-registration?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/v1/auth/oauth/data:
 *   get:
 *     summary: Get OAuth data for frontend
 *     tags: [Authentication]
 *     description: Returns OAuth configuration data needed by the frontend
 *     responses:
 *       200:
 *         description: OAuth configuration data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientId:
 *                   type: string
 *                   description: Google OAuth client ID
 *                 scope:
 *                   type: string
 *                   description: Required OAuth scopes
 *                 redirectUri:
 *                   type: string
 *                   description: OAuth redirect URI
 *       500:
 *         description: Server error
 */
router.get('/oauth/data', (req, res) => {
  if (!req.session.oauthData) {
    return res.status(404).json({ message: 'No OAuth data' });
  }
  res.json(req.session.oauthData);
});

module.exports = router;
