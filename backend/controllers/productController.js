const Product = require('../models/productModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const SearchFeatures = require('../utils/searchFeatures');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary');

// Get All Products
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {

    const resultPerPage = 12;
    const productsCount = await Product.countDocuments();
    // console.log(req.query);

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

// Get All Products ---Product Sliders
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
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

// Get All Products ---ADMIN
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

// Create Product ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
    // Helper function to flatten nested arrays
    const flattenArray = (arr) => {
        return arr.reduce((flat, item) => {
            return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
        }, []);
    };

    // Process images
    let images = [];
    if (req.body.images) {
        if (typeof req.body.images === 'string') {
            images.push(req.body.images);
        } else if (Array.isArray(req.body.images)) {
            // Flatten the nested arrays and filter out any empty values
            images = flattenArray(req.body.images).filter(img => img && typeof img === 'string');
        }
    }

    // Upload images to Cloudinary
    const imagesLink = [];
    try {
        for (let i = 0; i < images.length; i++) {
            if (typeof images[i] !== 'string') continue;
            
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
    } catch (error) {
        console.error('Error uploading images to Cloudinary:', error);
        return next(new ErrorHandler('Error uploading product images', 500));
    }

    // Handle brand logo
    let brandLogo = {};
    try {
        if (req.body.logo) {
            const result = await cloudinary.v2.uploader.upload(req.body.logo, {
                folder: "brands",
            });
            brandLogo = {
                public_id: result.public_id,
                    url: result.secure_url,
            };
        }
    } catch (error) {
        console.error('Error uploading brand logo to Cloudinary:', error);
        return next(new ErrorHandler('Error uploading brand logo', 500));
    }

    // Process highlights - ensure it's a flat array of strings
    let highlights = [];
    if (req.body.highlights) {
        if (Array.isArray(req.body.highlights)) {
            highlights = flattenArray(req.body.highlights)
                .filter(h => typeof h === 'string' && h.trim() !== '')
                .map(h => h.trim());
        } else if (typeof req.body.highlights === 'string') {
            highlights = [req.body.highlights.trim()];
        }
    }

    // Process specifications
    let specifications = [];
    if (req.body.specifications && Array.isArray(req.body.specifications)) {
        const flattenedSpecs = flattenArray(req.body.specifications);
        for (const spec of flattenedSpecs) {
            try {
                let specObj;
                if (typeof spec === 'string') {
                    specObj = JSON.parse(spec);
                } else if (typeof spec === 'object') {
                    specObj = spec;
                } else {
                    continue;
                }

                // Ensure required fields exist
                if (specObj.title && specObj.description) {
                    specifications.push({
                        title: specObj.title,
                        description: specObj.description
                    });
                }
            } catch (e) {
                console.error('Error parsing specification:', e);
                continue;
            }
        }
    }

    // Prepare product data
    const productData = {
        ...req.body,
        brand: {
            name: req.body.brandname,
            logo: brandLogo
        },
        images: imagesLink,
        highlights: highlights,
        specifications: specifications,
        user: req.user.id,
        // Convert string numbers to numbers
        price: parseFloat(req.body.price) || 0,
        cuttedPrice: parseFloat(req.body.cuttedPrice) || 0,
        stock: parseInt(req.body.stock) || 0,
        warranty: parseInt(req.body.warranty) || 0
    };

    // Create the product
    try {
        const product = await Product.create(productData);
        
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return next(new ErrorHandler('Error creating product: ' + error.message, 500));
    }
});

// Update Product ---ADMIN
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    // Helper function to flatten nested arrays
    const flattenArray = (arr) => {
        return arr.reduce((flat, item) => {
            return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
        }, []);
    };

    // Process new images if provided
    let imagesLink = [...product.images];
    if (req.body.images && req.body.images.length > 0) {
        let newImages = [];
        if (typeof req.body.images === 'string') {
            newImages.push(req.body.images);
        } else if (Array.isArray(req.body.images)) {
            newImages = flattenArray(req.body.images).filter(img => img && typeof img === 'string');
        }

        // Upload new images to Cloudinary
        for (let i = 0; i < newImages.length; i++) {
            if (typeof newImages[i] !== 'string') continue;
            
            try {
                const result = await cloudinary.v2.uploader.upload(newImages[i], {
                    folder: "products",
                });

                imagesLink.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            } catch (error) {
                console.error('Error uploading new images to Cloudinary:', error);
                // Continue with other images if one fails
            }
        }
    }

    // Handle brand logo update if provided
    let brandLogo = product.brand?.logo || {};
    if (req.body.logo && req.body.logo !== product.brand?.logo?.url) {
        try {
            // Delete old logo if exists
            if (brandLogo.public_id) {
                await cloudinary.v2.uploader.destroy(brandLogo.public_id);
            }
            
            const result = await cloudinary.v2.uploader.upload(req.body.logo, {
                folder: "brands",
            });
            
            brandLogo = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        } catch (error) {
            console.error('Error updating brand logo:', error);
            return next(new ErrorHandler('Error updating brand logo', 500));
        }
    }

    // Process highlights
    let highlights = product.highlights || [];
    if (req.body.highlights) {
        if (Array.isArray(req.body.highlights)) {
            highlights = flattenArray(req.body.highlights)
                .filter(h => typeof h === 'string' && h.trim() !== '')
                .map(h => h.trim());
        } else if (typeof req.body.highlights === 'string') {
            highlights = [req.body.highlights.trim()];
        }
    }

    // Process specifications
    let specifications = product.specifications || [];
    if (req.body.specifications && Array.isArray(req.body.specifications)) {
        const flattenedSpecs = flattenArray(req.body.specifications);
        specifications = [];
        
        for (const spec of flattenedSpecs) {
            try {
                let specObj;
                if (typeof spec === 'string') {
                    specObj = JSON.parse(spec);
                } else if (typeof spec === 'object') {
                    specObj = spec;
                } else {
                    continue;
                }

                if (specObj.title && specObj.description) {
                    specifications.push({
                        title: specObj.title,
                        description: specObj.description
                    });
                }
            } catch (e) {
                console.error('Error parsing specification:', e);
                continue;
            }
        }
    }

    // Prepare update data
    const updateData = {
        ...req.body,
        brand: {
            name: req.body.brandname || product.brand?.name,
            logo: brandLogo
        },
        images: imagesLink,
        highlights: highlights,
        specifications: specifications,
        // Convert string numbers to numbers if provided, otherwise keep existing values
        price: req.body.price ? parseFloat(req.body.price) : product.price,
        cuttedPrice: req.body.cuttedPrice ? parseFloat(req.body.cuttedPrice) : product.cuttedPrice,
        stock: req.body.stock ? parseInt(req.body.stock) : product.stock,
        warranty: req.body.warranty ? parseInt(req.body.warranty) : product.warranty
    };

    // Remove fields that shouldn't be updated
    delete updateData.brandname;
    delete updateData.logo; // Already handled separately

    // Update the product
    try {
        // Find and update the product
        product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return next(new ErrorHandler('Error updating product: ' + error.message, 500));
    }
});

// Delete Product ---ADMIN
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.remove();

    res.status(201).json({
        success: true
    });
});

// Create OR Update Reviews
exports.createProductReview = asyncErrorHandler(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const isReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());

    if (isReviewed) {

        product.reviews.forEach((rev) => { 
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating, rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

// Get All Reviews of Product
exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

// Delete Reveiws
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings: Number(ratings),
        numOfReviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});