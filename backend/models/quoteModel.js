const mongoose = require('mongoose');

const productItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    }
}, { _id: false });

const quoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    file: {
        type: String,
        default: ''
    },
    fileType: {
        type: String,
        enum: ['', 'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xls', 'xlsx']
    },
    fileName: {
        type: String,
        default: ''
    },
    products: {
        type: [productItemSchema],
        required: [true, 'At least one product is required'],
        validate: {
            validator: function(products) {
                return products.length > 0;
            },
            message: 'At least one product is required'
        }
    },
    comments: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Quote', quoteSchema);