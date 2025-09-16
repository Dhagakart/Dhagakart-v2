const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const Order = require('../../../models/orderModel');
const Product = require('../../../models/productModel');
const User = require('../../../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Test user data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test@123',
    role: 'user'
};

const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'admin'
};

// Test product data
const testProduct = {
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    category: 'Test Category',
    stock: 10,
    images: [{ url: 'test-image.jpg' }]
};

// Test order data
let testOrder;
let userToken;
let adminToken;
let productId;
let orderId;

// Connect to the test database before running tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Create test user and admin
    let user = await User.create(testUser);
    let admin = await User.create(adminUser);
    
    // Generate JWT tokens
    userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Create test product
    const product = await Product.create(testProduct);
    productId = product._id;

    // Create test order
    testOrder = {
        orderItems: [
            {
                name: 'Test Product',
                quantity: 1,
                image: 'test-image.jpg',
                price: 100,
                product: productId,
            },
        ],
        shippingInfo: {
            address: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            country: 'Test Country',
            pinCode: '123456',
            phoneNo: '1234567890',
        },
        paymentInfo: {
            id: 'test_payment_id',
            status: 'succeeded',
        },
        itemsPrice: 100,
        taxPrice: 18,
        shippingPrice: 0,
        totalPrice: 118,
        user: user._id,
    };

    const order = await Order.create(testOrder);
    orderId = order._id;
});

// Close the database connection after all tests are done
afterAll(async () => {
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Order Controller - Tracking', () => {
    describe('GET /api/v1/orders/recent', () => {
        it('should return recent orders for the authenticated user', async () => {
            const response = await request(app)
                .get('/api/v1/orders/recent')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.orders)).toBe(true);
            expect(response.body.orders.length).toBeGreaterThan(0);
            
            // Verify the order has tracking events
            const order = response.body.orders[0];
            expect(Array.isArray(order.trackingEvents)).toBe(true);
            expect(order.trackingEvents.length).toBeGreaterThan(0);
            expect(order.trackingEvents[0]).toHaveProperty('status');
            expect(order.trackingEvents[0]).toHaveProperty('description');
            expect(order.trackingEvents[0]).toHaveProperty('timestamp');
        });

        it('should respect the limit parameter', async () => {
            const limit = 1;
            const response = await request(app)
                .get(`/api/v1/orders/recent?limit=${limit}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(response.body.orders.length).toBeLessThanOrEqual(limit);
        });

        it('should return 401 if user is not authenticated', async () => {
            await request(app)
                .get('/api/v1/orders/recent')
                .expect(401);
        });
    });

    describe('POST /api/v1/order/:id/tracking', () => {
        it('should add a tracking event to an order (admin only)', async () => {
            const trackingData = {
                status: 'Shipped',
                description: 'Your order has been shipped.',
                location: 'Mumbai Warehouse'
            };

            const response = await request(app)
                .post(`/api/v1/order/${orderId}/tracking`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(trackingData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.order).toHaveProperty('trackingEvents');
            
            // Verify the tracking event was added
            const order = await Order.findById(orderId);
            const lastEvent = order.trackingEvents[order.trackingEvents.length - 1];
            
            expect(lastEvent.status).toBe(trackingData.status);
            expect(lastEvent.description).toBe(trackingData.description);
            expect(lastEvent.location).toBe(trackingData.location);
            expect(lastEvent).toHaveProperty('timestamp');
            
            // Verify order status was updated
            expect(order.orderStatus).toBe(trackingData.status);
        });

        it('should return 404 if order is not found', async () => {
            const nonExistentOrderId = new mongoose.Types.ObjectId();
            const trackingData = {
                status: 'Shipped',
                description: 'Test tracking event'
            };

            await request(app)
                .post(`/api/v1/order/${nonExistentOrderId}/tracking`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(trackingData)
                .expect(404);
        });

        it('should return 400 if required fields are missing', async () => {
            const invalidData = {
                // Missing status field
                description: 'This should fail'
            };

            await request(app)
                .post(`/api/v1/order/${orderId}/tracking`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidData)
                .expect(400);
        });

        it('should return 403 if user is not an admin', async () => {
            const trackingData = {
                status: 'Shipped',
                description: 'Regular users cannot add tracking'
            };

            await request(app)
                .post(`/api/v1/order/${orderId}/tracking`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(trackingData)
                .expect(403);
        });
    });
});
