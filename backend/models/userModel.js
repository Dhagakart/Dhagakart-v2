const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const addressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please enter a full name"],
    },
    primaryAddress: {
        type: String,
        required: [true, "Please enter the primary address"],
    },
    city: {
        type: String,
        required: [true, "Please enter a city"],
    },
    state: {
        type: String,
        required: [true, "Please enter a state"],
    },
    zipCode: {
        type: String,
        required: [true, "Please enter a zip code"],
    },
    country: {
        type: String,
        required: [true, "Please enter a country"],
        default: 'India',
    },
    phoneNumber: {
        type: String,
        required: [true, "Please enter a phone number"],
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    additionalInfo: {
        type: String,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
    },
    phone: {
        type: String,
        required: [true, "Please Enter Your Phone Number"],
    },
    city: {
        type: String,
        required: [true, "Please Enter Your City"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should have atleast 8 chars"],
        select: false,
    },
    businessName: {
        type: String,
        required: [true, "Please Enter Your Business Name"],
    },
    businessType: {
        type: String,
        required: [true, "Please Select Your Business Type"],
    },
    role: {
        type: String,
        default: "user",
    },
    shippingAddresses: [{
        fullName: {
            type: String,
            required: [true, "Please enter full name"],
        },
        primaryAddress: {
            type: String,
            required: [true, "Please enter primary address"],
        },
        country: {
            type: String,
            required: [true, "Please enter country"],
        },
        state: {
            type: String,
            required: [true, "Please enter state"],
        },
        city: {
            type: String,
            required: [true, "Please enter city"],
        },
        zipCode: {
            type: String,
            required: [true, "Please enter zip code"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Please enter phone number"],
        },
        email: {
            type: String,
            required: [true, "Please enter email"],
            validate: [validator.isEmail, "Please enter a valid email"],
        },
        additionalInfo: {
            type: String,
            required: false,
        },
        isDefault: {
            type: Boolean,
            default: false,
        }
    }],
    billingAddresses: [addressSchema],
    shippingAddresses: [addressSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, "WFFWf15115U842UGUBWF81EE858UYBY51BGBJ5E51Q", {
        expiresIn: "7d"
    });
}

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getResetPasswordToken = async function () {

    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // generate hash token and add to db
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);