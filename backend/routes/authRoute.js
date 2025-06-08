// routes/authRoute.js
console.log('🔐 authRoute.js loaded');
const express      = require('express');
const passport     = require('passport');
const User         = require('../models/userModel');
const sendToken    = require('../utils/sendToken');
const router       = express.Router();

// Kick off Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile','email'],
  })
);

// Handle Google’s callback
router.get(
  '/google/callback',
  // **NOTE**: we leave session: true so we can write to req.session
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res, next) => {
    try {
      const { displayName: name, emails } = req.user;
      const email = emails[0].value;

      // 1) If they already exist, just issue JWT cookie:
      let user = await User.findOne({ email });
      if (user) {
        return sendToken(user, 200, res);
      }

      // 2) NEW user → stash name/email and redirect to your React form
      req.session.oauthData = { name, email };
      return res.redirect(
        `${process.env.FRONTEND_URL}/oauth-complete-registration`
      );
    } catch (err) {
      next(err);
    }
  }
);

// Front-end will call this to prefill the form
router.get('/oauth/data', (req, res) => {
  if (!req.session.oauthData) {
    return res.status(404).json({ message: 'No OAuth data' });
  }
  res.json(req.session.oauthData);
});

module.exports = router;
