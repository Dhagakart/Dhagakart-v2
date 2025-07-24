const mongoose = require('mongoose');

const unitConfigSchema = new mongoose.Schema({
    unit: {
        type: String,
        required: true,
        trim: true
    },
    minQty: {
        type: Number,
        required: true,
        min: [0.01, 'Minimum quantity must be greater than 0'],
        default: 1
    },
    increment: {
        type: Number,
        required: true,
        min: [0.01, 'Increment must be greater than 0'],
        default: 1
    },
    maxQty: {
        type: Number,
        required: true,
        min: [1, 'Maximum quantity must be at least 1'],
        default: 25
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true,
        min: [0.01, 'Price must be greater than 0'],
        default: 0
    },
    cuttedPrice: {
        type: Number,
        required: true,
        min: [0.01, 'Cutted price must be greater than 0'],
        default: 0
    }
});

const productSchema = new mongoose.Schema({
    orderConfig: {
        units: {
            type: [unitConfigSchema],
            required: true,
            validate: {
                validator: function(v) {
                    // Exactly one unit must be marked as default
                    const defaultUnits = v.filter(unit => unit.isDefault);
                    return defaultUnits.length === 1;
                },
                message: 'Exactly one unit must be marked as default'
            },
            default: [{
                unit: 'unit',
                minQty: 1,
                increment: 1,
                maxQty: 25,
                isDefault: true
            }]
        }
    },
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    highlights: [
        {
            type: String,
            required: true
        }
    ],
    specifications: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    price: {
        type: Number,
        required: [true, "Please enter product price"]
    },
    cuttedPrice: {
        type: Number,
        required: [true, "Please enter cutted price"]
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"]
    },
    subCategory: {
        type: String,
        required: [true, "Please enter product sub category"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxlength: [4, "Stock cannot exceed limit"],
        default: 1
    },
    warranty: {
        type: Number,
        default: 1
    },
    ratings: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);