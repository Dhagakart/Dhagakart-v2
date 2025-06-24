const express = require('express');
const { 
    createQuote, 
    getMyQuotes, 
    getSingleQuote, 
    getAllQuotes, 
    updateQuoteStatus, 
    deleteQuote 
} = require('../controllers/quoteController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// Configure express to handle larger payloads
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ extended: true, limit: '50mb' }));

// User routes (authenticated)
router.post('/new', isAuthenticatedUser, createQuote);

// User routes
router.get('/me', isAuthenticatedUser, getMyQuotes);
router.get('/:id', isAuthenticatedUser, getSingleQuote);

// Admin routes
router.get(
    '/admin/all', 
    isAuthenticatedUser, 
    authorizeRoles('admin'), 
    getAllQuotes
);

router.put(
    '/admin/status/:id', 
    isAuthenticatedUser, 
    authorizeRoles('admin'), 
    updateQuoteStatus
);

router.delete(
    '/admin/:id', 
    isAuthenticatedUser, 
    authorizeRoles('admin'), 
    deleteQuote
);

module.exports = router;