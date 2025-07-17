const Product = require('../models/productModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const SearchFeatures = require('../utils/searchFeatures');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary');

// Get All Products (with filters, search, and pagination)
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
    const resultPerPage = 12;
    const productsCount = await Product.countDocuments();

    const searchFeature = new SearchFeatures(Product.find(), req.query)
        .search()
        .filter();

    let products = await searchFeature.query;
    let filteredProductsCount = products.length;

    searchFeature.pagination(resultPerPage);
    products = await searchFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// Get Product Details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});

// Get All Products --- ADMIN
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    });
});

// Create Product --- ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
    const productData = { ...req.body, user: req.user.id };

    if (req.body.orderConfig) productData.orderConfig = JSON.parse(req.body.orderConfig);
    if (req.body.specifications) productData.specifications = JSON.parse(req.body.specifications);

    if (req.body.images) {
        const imagesToUpload = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        const imagesLink = [];
        for (const image of imagesToUpload) {
            const result = await cloudinary.v2.uploader.upload(image, { folder: "products" });
            imagesLink.push({ public_id: result.public_id, url: result.secure_url });
        }
        productData.images = imagesLink;
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
});

// Update Product --- ADMIN
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    const updateData = { ...req.body };
    let finalImages = [...product.images];

    if (req.body.removedImages) {
        const publicIdsToRemove = Array.isArray(req.body.removedImages) ? req.body.removedImages : [req.body.removedImages];
        for (const publicId of publicIdsToRemove) {
            await cloudinary.v2.uploader.destroy(publicId);
        }
        finalImages = finalImages.filter(img => !publicIdsToRemove.includes(img.public_id));
    }

    if (req.body.images) {
        const newImagesToUpload = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        for (const image of newImagesToUpload) {
            const result = await cloudinary.v2.uploader.upload(image, { folder: "products" });
            finalImages.push({ public_id: result.public_id, url: result.secure_url });
        }
    }
    updateData.images = finalImages;

    if (req.body.orderConfig) updateData.orderConfig = JSON.parse(req.body.orderConfig);
    if (req.body.specifications) updateData.specifications = JSON.parse(req.body.specifications);
    
    delete updateData.removedImages;

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true, runValidators: true, useFindAndModify: false,
    });

    res.status(200).json({ success: true, product });
});

// Delete Product --- ADMIN
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    for (const image of product.images) {
        await cloudinary.v2.uploader.destroy(image.public_id);
    }

    await product.remove();
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

// Create or Update a Review
exports.createProductReview = asyncErrorHandler(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };

    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
    }

    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({ success: true });
});

// Get All Reviews of a Product --- ADMIN
exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    res.status(200).json({ success: true, reviews: product.reviews });
});

// Delete a Review --- ADMIN
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());
    const numOfReviews = reviews.length;
    const ratings = numOfReviews === 0 ? 0 : reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, {
        new: true, runValidators: true, useFindAndModify: false,
    });

    res.status(200).json({ success: true });
});