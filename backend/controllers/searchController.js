const Product = require('../models/productModel');

exports.searchProducts = async (req, res) => {
    try {
        const { keyword } = req.query;
        
        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: 'Keyword is required'
            });
        }

        // Search products based on name and category
        const suggestions = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } }
            ]
        }).select('name category price image')
        .limit(5);

        return res.status(200).json({
            success: true,
            suggestions
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
