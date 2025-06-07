const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncErrorHandler = require('./asyncErrorHandler');

exports.isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
    console.log('Cookies:', req.cookies); // Debug log
    console.log('Headers:', req.headers); // Debug log
    const token = req.cookies.token;
    console.log('Extracted token:', token); // Debug log

    if (!token) {
        console.log('No Token Found');
        return next(new ErrorHandler("Please Login to Access", 401))
    }

    // const decodedData = jwt.verify(token, "WFFWf15115U842UGUBWF81EE858UYBY51BGBJ5E51Q");
    // req.user = await User.findById(decodedData.id);
    // next();

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();
    } catch (error) {
        console.log('Token verification error:', error); // Debug log
        return next(new ErrorHandler("Invalid or expired token", 401));
    }
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed`, 403));
        }
        next();
    }
}