const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'travelapp/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, crop: 'limit' }]
    }
});

const uploadImages = multer({ storage: imageStorage });

module.exports = { uploadImages };