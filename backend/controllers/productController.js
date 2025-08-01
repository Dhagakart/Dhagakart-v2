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
    try {
        const productData = { ...req.body, user: req.user.id };

        // Handle orderConfig
        try {
            if (req.body.orderConfig) {
                // If it's a string, parse it
                if (typeof req.body.orderConfig === 'string') {
                    productData.orderConfig = JSON.parse(req.body.orderConfig);
                } else {
                    productData.orderConfig = req.body.orderConfig;
                }
                
                // Ensure orderConfig has the correct structure with units array
                if (!Array.isArray(productData.orderConfig)) {
                    productData.orderConfig = { units: [productData.orderConfig] };
                } else if (productData.orderConfig.length > 0 && !productData.orderConfig[0].units) {
                    productData.orderConfig = { units: productData.orderConfig };
                }
                
                // Ensure each unit has required fields with valid values
                if (productData.orderConfig.units && productData.orderConfig.units.length > 0) {
                    productData.orderConfig.units = productData.orderConfig.units.map(unit => ({
                        unit: unit.unit || 'unit',
                        minQty: unit.minQty || 1,
                        increment: unit.increment || 1,
                        maxQty: unit.maxQty || 25,
                        isDefault: unit.isDefault !== undefined ? unit.isDefault : true,
                        price: Math.max(0.01, parseFloat(unit.price) || parseFloat(req.body.price) || 1),
                        cuttedPrice: Math.max(0.01, parseFloat(unit.cuttedPrice) || parseFloat(req.body.cuttedPrice) || 1)
                    }));
                }
            } else {
                // Default orderConfig if not provided
                const price = Math.max(0.01, parseFloat(req.body.price) || 1);
                const cuttedPrice = Math.max(0.01, parseFloat(req.body.cuttedPrice) || price);
                
                productData.orderConfig = {
                    units: [{
                        unit: 'unit',
                        minQty: 1,
                        increment: 1,
                        maxQty: 25,
                        isDefault: true,
                        price: price,
                        cuttedPrice: cuttedPrice
                    }]
                };
            }
        } catch (error) {
            console.error('Error processing orderConfig:', error);
            // Fallback to default config if there's an error
            const price = Math.max(0.01, parseFloat(req.body.price) || 1);
            const cuttedPrice = Math.max(0.01, parseFloat(req.body.cuttedPrice) || price);
            
            productData.orderConfig = {
                units: [{
                    unit: 'unit',
                    minQty: 1,
                    increment: 1,
                    maxQty: 25,
                    isDefault: true,
                    price: price,
                    cuttedPrice: cuttedPrice
                }]
            };
        }

        // Handle specifications
        try {
            if (req.body.specifications) {
                // If it's a string, parse it
                if (typeof req.body.specifications === 'string') {
                    productData.specifications = JSON.parse(req.body.specifications);
                } else {
                    productData.specifications = req.body.specifications;
                }
                
                // Ensure specifications is an array
                if (!Array.isArray(productData.specifications)) {
                    // If it's a single object, convert it to an array
                    if (typeof productData.specifications === 'object' && productData.specifications !== null) {
                        productData.specifications = [productData.specifications];
                    } else {
                        productData.specifications = [];
                    }
                }
                
                // Ensure each spec has required fields
                productData.specifications = productData.specifications
                    .filter(spec => spec && (spec.title || spec.description))
                    .map(spec => ({
                        title: spec.title || '',
                        description: spec.description || ''
                    }));
            } else {
                productData.specifications = [];
            }
        } catch (error) {
            console.error('Error processing specifications:', error);
            productData.specifications = [];
        }

        // Handle image uploads
        if (req.body.images) {
            const imagesToUpload = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            const imagesLink = [];
            
            for (const image of imagesToUpload) {
                if (image) { // Only process if image exists
                    try {
                        const result = await cloudinary.v2.uploader.upload(image, { 
                            folder: "products",
                            resource_type: 'auto' 
                        });
                        imagesLink.push({ 
                            public_id: result.public_id, 
                            url: result.secure_url 
                        });
                    } catch (uploadError) {
                        console.error('Error uploading image to Cloudinary:', uploadError);
                        // Continue with other images even if one fails
                    }
                }
            }
            
            if (imagesLink.length > 0) {
                productData.images = imagesLink;
            } else {
                return next(new ErrorHandler('Failed to upload product images', 400));
            }
        }

        const product = await Product.create(productData);
        res.status(201).json({ success: true, product });
        
    } catch (error) {
        console.error('Error in createProduct:', error);
        return next(new ErrorHandler(error.message || 'Error creating product', 500));
    }
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

    // ✨ FIXED: Return the full updated product object for frontend efficiency
    res.status(200).json({
        success: true,
        product,
    });
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