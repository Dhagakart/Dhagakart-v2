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
    callbackURL: "/api/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            return done(null, user);
        }

        // Create new user if doesn't exist
        user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: {
                public_id: 'default',
                url: profile.photos[0].value
            },
            password: 'oauthuser', // You might want to handle this differently
            isVerified: true
        });

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
