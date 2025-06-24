const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'file-' + uniqueSuffix + ext);
    }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
    // Accept only specific file types
    const filetypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only the following file types are allowed: JPEG, JPG, PNG, PDF, DOC, DOCX, XLS, XLSX'));
    }
};

// Configure multer with specific field names
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 1
    }
});

// Add a middleware to log form data for debugging
const handleFileUpload = (req, res, next) => {
    const uploadSingle = upload.single('file');
    
    uploadSingle(req, res, function(err) {
        if (err) {
            console.error('File upload error:', err);
            return res.status(400).json({
                success: false,
                message: err.message || 'Error uploading file'
            });
        }
        next();
    });
};

module.exports = handleFileUpload;
