const path = require('path');
const express = require('express');
const cloudinary = require('cloudinary');
const http = require('http');
const { Server } = require("socket.io");
const axios = require('axios');

// --- MOVED TO TOP ---
// Load environment variables immediately, before any other modules are required.
if (process.env.NODE_ENV !== 'production') {
    // This path should point to your .env file relative to the root directory.
    require('dotenv').config({ path: 'backend/.env' });
}
// --------------------

const app = require('./backend/app'); // Now 'app' will have access to the loaded env variables
const connectDatabase = require('./backend/config/database');

const PORT = process.env.PORT || 4000;

// UncaughtException Error
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

// --- START: WebSocket and Server Setup ---
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

// Attach the 'io' instance to the app object to make it accessible in controllers
app.set('socketio', io);

io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`Socket Disconnected: ${socket.id}`);
    });
});
// --- END: WebSocket and Server Setup ---

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
    if (req.originalUrl.includes('/api/v1/quote')) {
        return fileUpload({
            useTempFiles: true,
            tempFileDir: tempDir,
            limits: { fileSize: 50 * 1024 * 1024 },
            abortOnLimit: true,
            responseOnLimit: 'File size is too large. Max 50MB allowed.',
            createParentPath: true,
            safeFileNames: true,
            preserveExtension: 4,
            parseNested: false,
            debug: process.env.NODE_ENV !== 'production',
            uploadTimeout: 300000
        })(req, res, next);
    } else {
        next();
    }
});

// Deployment configuration
const __dirname_global = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname_global, '/frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname_global, 'frontend', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.json({
            message: 'API is running in development mode',
            documentation: `http://localhost:${PORT}/api-docs`,
        });
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running', timestamp: new Date().toISOString() });
});

// --- MODIFIED: Start the httpServer instead of the Express app directly ---
const server = httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Frontend URL: http://localhost:${process.env.FRONTEND_PORT || 5173}`);
    console.log(`Backend API: http://localhost:${PORT}/api/v1`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

// Health check and graceful shutdown logic
const pingServer = async () => {
    try {
        const url = process.env.NODE_ENV === 'production' ? 'https://dhagakart.onrender.com/health' : `http://localhost:${PORT}/health`;
        await axios.get(url);
        console.log(`Health check successful at ${new Date().toISOString()}`);
    } catch (error) {
        console.error('Health check failed:', error.message);
    }
};

const healthCheckInterval = setInterval(pingServer, 60000);
pingServer();

const shutdown = () => {
    clearInterval(healthCheckInterval);
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error('Error:', err);
    server.close(() => {
        process.exit(1);
    });
});
