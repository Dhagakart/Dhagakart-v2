// routes/authRoute.js
const router = require('express').Router();
const passport = require('passport');
const User = require('../models/userModel');
const sendToken = require('../utils/sendToken');

// Kick off Google OAuth
router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  
  // Handle callback
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req, res, next) => {
      try {
        const { displayName: name, emails } = req.user;
        const email = emails[0].value;
  
        // If user exists, send token
        let user = await User.findOne({ email });
        if (user) {
          return sendToken(user, 200, res);
        }
  
        // Else, stash in session and redirect to frontend for completion
        req.session.oauthData = { name, email };
        res.redirect(`${process.env.FRONTEND_URL}/oauth-complete-registration`);
      } catch (err) {
        next(err);
      }
    }
  );
  
  // Expose the stubbed data
  router.get('/oauth/data', (req, res) => {
    if (!req.session.oauthData) {
      return res.status(404).json({ message: 'No OAuth data' });
    }
    res.json(req.session.oauthData);
  });
  
  module.exports = router;