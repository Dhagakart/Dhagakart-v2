const Quote = require('../models/quoteModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary').v2;

// Create New Quote
// POST /api/quote/new
// Public
const createQuote = asyncErrorHandler(async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        // Parse the products JSON string
        let products = [];
        try {
            products = req.body.products ? JSON.parse(req.body.products) : [];
        } catch (parseError) {
            console.error('Error parsing products:', parseError);
            return next(new ErrorHandler('Invalid products format', 400));
        }
        
        const comments = req.body.comments || '';
        
        // If file was uploaded
        let fileData = {};
        if (req.files && req.files.file) {
            const file = req.files.file;
            
            try {
                let result;
                
                if (file.tempFilePath) {
                    // If we have a temp file path, use that for upload
                    result = await cloudinary.uploader.upload(file.tempFilePath, {
                        folder: 'dhagakart/quotes',
                        resource_type: 'auto',
                        use_filename: true,
                        unique_filename: true
                    });
                } else if (file.data) {
                    // If we have file data as buffer
                    result = await new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                folder: 'dhagakart/quotes',
                                resource_type: 'auto',
                                use_filename: true,
                                unique_filename: true
                            },
                            (error, result) => {
                                if (error) {
                                    console.error('Cloudinary upload error:', error);
                                    reject(new Error('Failed to upload file to Cloudinary'));
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                        // Create a readable stream from buffer
                        const { Readable } = require('stream');
                        const stream = Readable.from(file.data);
                        stream.pipe(uploadStream);
                    });
                } else {
                    throw new Error('No file data or temp file path available');
                }
                
                fileData = {
                    file: result.secure_url,
                    fileType: result.format || file.mimetype.split('/').pop(),
                    fileName: result.original_filename || file.name
                };
                
            } catch (uploadError) {
                console.error('File upload error:', uploadError);
                return next(new ErrorHandler('Failed to process file upload', 500));
            }
        }

        // Validate products
        if (!Array.isArray(products) || products.length === 0) {
            return next(new ErrorHandler('At least one product is required', 400));
        }

        // Validate each product
        const validatedProducts = products.map(p => ({
            name: p.name || 'Unnamed Product',
            quantity: Math.max(1, parseInt(p.quantity) || 1)
        }));

        // Create the quote
        const quote = await Quote.create({
            user: req.user?._id || null,
            products: validatedProducts,
            comments,
            ...fileData
        });

        console.log('Quote created successfully:', quote);
        
        res.status(201).json({
            success: true,
            quote
        });
    } catch (error) {
        console.error('Error in createQuote:', error);
        return next(new ErrorHandler(error.message || 'Error creating quote', 500));
    }

});

// Get all quotes (Admin)
// GET /api/admin/quotes
// Admin only
const getAllQuotes = asyncErrorHandler(async (req, res, next) => {
    const quotes = await Quote.find().populate('user', 'name email');

    res.status(200).json({
        success: true,
        quotes,
        count: quotes.length
    });
});

// Get single quote
// GET /api/quote/:id
// Authenticated user or admin
const getSingleQuote = asyncErrorHandler(async (req, res, next) => {
    const quote = await Quote.findById(req.params.id).populate('user', 'name email');

    if (!quote) {
        return next(new ErrorHandler('Quote not found', 404));
    }

    // Check if user is the owner or admin
    if (quote.user && quote.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new ErrorHandler('Not authorized to access this quote', 403));
    }

    res.status(200).json({
        success: true,
        quote
    });
});

// Get current user's quotes
// GET /api/quote/me?page=1&limit=10
// Authenticated user
const getMyQuotes = asyncErrorHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const quotesQuery = Quote.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const countQuery = Quote.countDocuments({ user: req.user._id });

    const [quotes, total] = await Promise.all([quotesQuery, countQuery]);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
        success: true,
        quotes,
        count: quotes.length,
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
    });
});

// Update quote status (Admin)
// PUT /api/admin/quote/:id
// Admin only
const updateQuoteStatus = asyncErrorHandler(async (req, res, next) => {
    const { status } = req.body;
    
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
        return next(new ErrorHandler('Quote not found', 404));
    }

    quote.status = status;
    await quote.save();

    res.status(200).json({
        success: true,
        quote
    });
});

// Delete quote (Admin)
// DELETE /api/admin/quote/:id
// Admin only
const deleteQuote = asyncErrorHandler(async (req, res, next) => {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
        return next(new ErrorHandler('Quote not found', 404));
    }

    // TODO: Delete associated file from storage if needed

    await quote.remove();

    res.status(200).json({
        success: true,
        message: 'Quote deleted successfully'
    });
});

module.exports = {
    createQuote,
    getAllQuotes,
    getSingleQuote,
    getMyQuotes,
    updateQuoteStatus,
    deleteQuote
};