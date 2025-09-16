const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('../../models/orderModel');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flipkart-mern';

async function migrate() {
    try {
        console.log('Starting migration: Add trackingEvents to existing orders...');
        
        // Connect to the database
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connected to MongoDB');
        
        // Find all orders that don't have the trackingEvents field
        const orders = await Order.find({
            $or: [
                { trackingEvents: { $exists: false } },
                { trackingEvents: null },
                { trackingEvents: { $size: 0 } }
            ]
        });
        
        console.log(`Found ${orders.length} orders to update`);
        
        // Update each order with a default tracking event
        let updatedCount = 0;
        for (const order of orders) {
            // Only add default tracking event if no tracking events exist
            if (!order.trackingEvents || order.trackingEvents.length === 0) {
                const defaultEvent = {
                    status: 'Order Placed',
                    description: 'Your order has been placed successfully.',
                    timestamp: order.createdAt || new Date()
                };
                
                // Add the default event
                order.trackingEvents = [defaultEvent];
                
                // If the order has a status, add it as a tracking event
                if (order.orderStatus && order.orderStatus !== 'Order Placed') {
                    order.trackingEvents.push({
                        status: order.orderStatus,
                        description: `Order status updated to ${order.orderStatus}`,
                        timestamp: order.updatedAt || new Date()
                    });
                }
                
                await order.save();
                updatedCount++;
                
                // Log progress every 100 orders
                if (updatedCount % 100 === 0) {
                    console.log(`Updated ${updatedCount} orders...`);
                }
            }
        }
        
        console.log(`Migration completed. Updated ${updatedCount} orders with tracking events.`);
        
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        // Close the database connection
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the migration
migrate();
