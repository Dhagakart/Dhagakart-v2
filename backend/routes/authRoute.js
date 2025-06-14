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

// Front-end will call this to prefill the form
router.get('/oauth/data', (req, res) => {
  if (!req.session.oauthData) {
    return res.status(404).json({ message: 'No OAuth data' });
  }
  res.json(req.session.oauthData);
});

module.exports = router;
