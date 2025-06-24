const path = require('path');
const express = require('express');
const cloudinary = require('cloudinary');
const app = require('./backend/app');
const connectDatabase = require('./backend/config/database');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/.env' });
}

const PORT = process.env.PORT || 5000;

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
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Configure temporary directory for file uploads
const os = require('os');
const fs = require('fs');

const tempDir = path.join(os.tmpdir(), 'dhagakart-uploads');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configure file upload
const fileUpload = require('express-fileupload');
app.use((req, res, next) => {
    // Only apply file upload middleware to the quotes endpoint
    if (req.originalUrl.includes('/api/v1/quote')) {
        return fileUpload({
            useTempFiles: true,
            tempFileDir: tempDir,
            limits: { 
                fileSize: 50 * 1024 * 1024, // 50MB max file size
                files: 1,
                fields: 5 // Limit number of form fields
            },
            abortOnLimit: true,
            responseOnLimit: 'File size is too large. Max 50MB allowed.',
            createParentPath: true,
            safeFileNames: true,
            preserveExtension: 4, // Keep file extension (up to 4 chars)
            parseNested: false,
            debug: process.env.NODE_ENV !== 'production',
            uploadTimeout: 300000 // 5 minutes timeout for large files
        })(req, res, next);
    } else {
        next();
    }
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
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);    
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
