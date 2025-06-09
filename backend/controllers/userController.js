const User = require('../models/userModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const sendToken = require('../utils/sendToken');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register User
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
    try {
        const { name, email, password, phone, city, businessName, businessType } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new ErrorHandler('User already exists with this email', 400));
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            city,
            businessName,
            businessType,
            role: 'user' // Default role
        });

        // Use sendToken to handle token in cookie
        sendToken(user, 201, res);

    } catch (error) {
        console.error('Registration error:', error);
        return next(new ErrorHandler('Registration failed. Please try again.', 500));
    }
});

// Login User
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email And Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 201, res);
});

// Logout User
exports.logoutUser = asyncErrorHandler(async (req, res, next) => {
    const options = {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
    };

    res.cookie("token", null, options);

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Get User Details
exports.getUserDetails = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// Forgot Password
// exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {

//     const user = await User.findOne({email: req.body.email});

//     if(!user) {
//         return next(new ErrorHandler("User Not Found", 404));
//     }

//     const resetToken = await user.getResetPasswordToken();

//     await user.save({ validateBeforeSave: false });

//     // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
//     const resetPasswordUrl = `https://${req.get("host")}/password/reset/${resetToken}`;

//     // const message = `Your password reset token is : \n\n ${resetPasswordUrl}`;

//     try {
//         await sendEmail({
//             email: user.email,
//             templateId: process.env.SENDGRID_RESET_TEMPLATEID,
//             data: {
//                 reset_url: resetPasswordUrl
//             }
//         });

//         res.status(200).json({
//             success: true,
//             message: `Email sent to ${user.email} successfully`,
//         });

//     } catch (error) {
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;

//         await user.save({ validateBeforeSave: false });
//         return next(new ErrorHandler(error.message, 500))
//     }
// });

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    const resetToken = await user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;

    const message = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Password Reset Request</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f5f5f5;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f5f5f5; padding:20px 0;">
            <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; font-family:Arial, sans-serif; color:#333;">
                
                <!-- Header -->
                <tr>
                    <td style="background-color:#003366; text-align:center; padding:20px;">
                    <h2 style="margin:0; font-size:24px; color:#ffffff; line-height:1.2;">
                        Password Reset Request
                    </h2>
                    </td>
                </tr>
                
                <!-- Content -->
                <tr>
                    <td style="padding:30px;">
                    <p style="font-size:16px; margin:0 0 16px;">Hello ${user.name},</p>
                    <p style="font-size:16px; margin:0 0 24px;">
                        We received a request to reset your password. Click the button below to set a new password:
                    </p>
                    <div style="text-align:center; margin-bottom:24px;">
                        <a
                        href="${resetPasswordUrl}"
                        style="
                            display:inline-block;
                            padding:12px 24px;
                            background-color:#003366;
                            color:#ffffff !important;
                            text-decoration:none;
                            font-size:16px;
                            border-radius:5px;
                        "
                        >
                        Reset Password
                        </a>
                    </div>
                    <p style="font-size:14px; margin:0 0 8px;">
                        Or copy and paste this link into your browser:
                    </p>
                    <p style="font-size:14px; word-break:break-all; margin:0 0 16px;">
                        <a href="${resetPasswordUrl}" style="color:#003366; text-decoration:none;">
                        ${resetPasswordUrl}
                        </a>
                    </p>
                    <p style="font-size:14px; margin:0 0 8px;">
                        If you didn’t request a password reset, you can safely ignore this email.
                    </p>
                    <p style="font-size:14px; margin:0;">
                        This link will expire in 1 hour.
                    </p>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td style="background-color:#fafafa; text-align:center; padding:20px; font-size:12px; color:#777;">
                    © ${new Date().getFullYear()} DhagaKart. All rights reserved.
                    </td>
                </tr>
                
                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request - Dhagakart',
            message: message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {

    // create hash token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Invalid reset password token", 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
});

// Update Password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is Invalid", 400));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 201, res);
});

// Update User Profile
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    });

    res.status(200).json({
        success: true,
    });
});

// ADMIN DASHBOARD

// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// Get Single User Details --ADMIN
exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Role --ADMIN
exports.updateUserRole = asyncErrorHandler(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        role: req.body.role,
    }

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// Delete Role --ADMIN
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404));
    }

    await user.remove();

    res.status(200).json({
        success: true
    });
});