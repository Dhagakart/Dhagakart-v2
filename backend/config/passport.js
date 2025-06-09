const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '959569465279-5rsiuvee546ffk0g3kmilri42ff7js6c.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
    // callbackURL: "http://localhost:4000/api/v1/auth/google/callback"
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "https://dhagakart.onrender.com/api/v1/auth/google/callback"
    // callbackURL: "http://localhost:4000/api/v1/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Pass the profile data instead of creating a user
    return done(null, profile);
}));

module.exports = passport;