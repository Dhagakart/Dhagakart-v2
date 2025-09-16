const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const errorMiddleware = require('./middlewares/error');
const swaggerOptions = require('./config/swagger');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('./config/passport');
const path = require('path');

const app = express();

// config
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

app.use(express.static(path.join(__dirname, '..', 'client'))); 

const allowedOrigins = ['http://localhost:5173', 'https://dhagakart-jfaj.vercel.app', 'https://dhagakart.com', 'https://www.dhagakart.com', 'http://localhost:4000'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
        }
    },
    credentials: true,
    exposedHeaders: ['set-cookie', 'date', 'etag'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: (process.env.COOKIE_EXPIRE || 5) * 24 * 60 * 60
    }),
    cookie: {
        maxAge: (process.env.COOKIE_EXPIRE || 5) * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Route Imports
const user = require('./routes/userRoute');
const authRoutes = require('./routes/authRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');
const quote = require('./routes/quoteRoute');
const search = require('./routes/searchRoute');
// const tracking = require('./routes/trackingRoute');

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', user);
app.use('/api/v1/quote', quote);
app.use('/api/v1/', product);
app.use('/api/v1/', order);
app.use('/api/v1/', payment);
app.use('/api/v1/search', search);
// app.use('/api/v1/tracking', tracking);

// Swagger
// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//     explorer: true,
//     customSiteTitle: 'DhagaKart ECommerce API Documentation'
// }));

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
