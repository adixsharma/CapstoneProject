/*
    Authors: Fernando Malca

    Conversion of upload data (mp4/mov, pdf, jpeg/png)
*/

const multer = require('multer');
const path = require('path');

// Define allowed file types for each field
const ALLOWED_MIME_TYPES = {
    profilePic: ['image/png', 'image/jpeg'],
    cv: ['application/pdf'],
    video: ['video/mp4', 'video/quicktime'],
};

// Configure storage
const storage = multer.memoryStorage();

// Multer file filter for validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = ALLOWED_MIME_TYPES[file.fieldname];
    if (!allowedTypes) {
        return cb(new Error(`Unexpected field: ${file.fieldname}`));
    }

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${allowedTypes.join(', ')}`));
    }

    cb(null, true);
};

module.exports = multer({
    storage,
    fileFilter,
}).fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]);


