const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: false
        },
        businessName: {
            type: String,
            required: true
        },
        businessType: {
            type: String,
            required: true
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            },
            unit: {
                name: {
                    type: String,
                    required: true
                },
                minQty: {
                    type: Number,
                    default: 1
                },
                maxQty: {
                    type: Number,
                    required: false
                },
                increment: {
                    type: Number,
                    default: 1
                },
                isDefault: {
                    type: Boolean,
                    default: false
                },
                price: {
                    type: Number,
                    required: true
                },
                cuttedPrice: {
                    type: Number,
                    required: false
                }
            }
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    // isSampleOrder: {
    //     type: Boolean,
    //     default: false,
    //     required: true
    // },
    sampleConfig: {
        isSampleAvailable: {
            type: Boolean,
            default: false,
        },
        price: {
            type: Number,
            default: 0,
            required: [function() { return this.isSampleAvailable; }, 'Sample price is required if samples are available.'],
        },
        maxQuantity: {
            type: Number,
            default: 1,
            required: [function() { return this.isSampleAvailable; }, 'Max sample quantity is required if samples are available.'],
        },
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
    },
    paidAt: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    deliveredAt: Date,
    shippedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    vrlInvoiceLink: {
        type: String,
        default: ''
    },
    consignmentNumber: {
        type: String,
        default: ''
    },
});

module.exports = mongoose.model("Order", orderSchema);