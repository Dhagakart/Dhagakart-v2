const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    // If err is not an object, create a proper error object
    if (!err || typeof err !== 'object') {
        console.error('Invalid error object received:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: 'An unknown error occurred'
        });
    }

    // Ensure we have default values
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error for debugging
    console.error('Error Details:', {
        message: message,
        statusCode: statusCode,
        name: err.name || 'Error',
        code: err.code || 'NO_CODE',
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });

    // Handle specific error types
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Resource not found. Invalid: ${err.path || 'ID'}`
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: `Duplicate ${Object.keys(err.keyValue || {})} entered`
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Please log in again.'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Your session has expired. Please log in again.'
        });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: messages
        });
    }

    // Handle all other errors
    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};