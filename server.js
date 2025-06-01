const path = require('path');
const express = require('express');
const cloudinary = require('cloudinary');
const app = require('./backend/app');
const connectDatabase = require('./backend/config/database');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/config/.env' });
}

const PORT = process.env.PORT || 4000;

// UncaughtException Error - Handle any uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error('Error:', err);
    process.exit(1);
});

// Connect to the database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dnzj28iea',
    api_key: process.env.CLOUDINARY_API_KEY || '916114165888191',
    api_secret: process.env.CLOUDINARY_API_SECRET || '7nNwmmX6Vsw8Cpn3q0eoZalEZdY',
});

// Deployment configuration
__dirname = path.resolve();

// In production, serve static files from the React app
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
    });
} else {
    // Simple route for testing in development
    app.get('/', (req, res) => {
        res.send('Server is Running! 🚀');
    });
}

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);    
    console.log(`Frontend URL: http://localhost:${process.env.FRONTEND_PORT || 5173}`);
    console.log(`Backend API: http://localhost:${PORT}/api/v1`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error('Error:', err);
    
    // Close the server and exit the process
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM signal for graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});
