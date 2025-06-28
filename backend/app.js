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
require('./config/passport'); // Import passport config

const app = express();

// config
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

// const corsOptions = {
//     origin: [
//         'https://dhagakart-jfaj.vercel.app',
//         'http://localhost:5173' // for local development
//     ],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//     exposedHeaders: ['Content-Range', 'X-Content-Range'],
//     optionsSuccessStatus: 200
// };

const allowedOrigins = ['http://localhost:5173', 'https://dhagakart-jfaj.vercel.app'];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  exposedHeaders: ['set-cookie', 'date', 'etag'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions)); // Enable preflight for all routes

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb+srv://dsharpstechnology:ek51DYZg5p1isPQr@cluster0.q5ok6w4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        ttl: process.env.COOKIE_EXPIRE * 24 * 60 * 60 // = 5 days. Default
    }),
    cookie: {
        maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000, // 5 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Increase JSON and URL-encoded body parser limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Configure file upload with larger limits
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Pre-flight requests
app.options('*', cors(corsOptions));

const user = require('./routes/userRoute');
const authRoutes = require('./routes/authRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');
const quote = require('./routes/quoteRoute');

// API Route
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', user);
app.use('/api/v1/quote', quote);
app.use('/api/v1/', product);
app.use('/api/v1/', order);
app.use('/api/v1/', payment);

function printRoutes(stack, parentPath = '') {
  return stack.flatMap(layer => {
    if (layer.route && layer.route.path) {
      // Route directly on app
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      return [`  ${methods} ${parentPath}${layer.route.path}`];
    } else if (layer.name === 'router' && layer.handle.stack) {
      // Nested router (e.g. /api/v1/users)
      const newParentPath = parentPath + (layer.regexp.source
        .replace('^\\/', '/')
        .replace('\\/?(?=\\/|$)', '')
        .replace('(?=\\/|$)', '')
        .replace('^', '')
        .replace('$', '')
        .replace('\\', '')
      );
      return printRoutes(layer.handle.stack, newParentPath);
    } else {
      return [];
    }
  });
}

console.log('\n⚙️  Mounted routes:\n' + printRoutes(app._router.stack).join('\n') + '\n');


// Initialize Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, { 
    explorer: true,
    customSiteTitle: 'Flipkart MERN API Documentation'
  })
);

// error middleware
app.use(errorMiddleware);

// Log available routes
console.log('\n📚 API Documentation available at http://localhost:4000/api-docs');

module.exports = app;