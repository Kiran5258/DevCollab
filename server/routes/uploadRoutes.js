const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// No multer needed for Base64!
router.post('/', protect, uploadImage);

module.exports = router;
