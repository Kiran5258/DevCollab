const cloudinary = require('../config/cloudinary');

// @desc    Upload image to Cloudinary using Base64
// @route   POST /api/upload
// @access  Private
exports.uploadImage = async (req, res, next) => {
  try {
    const { image } = req.body;

    if (!image) {
      res.status(400);
      throw new Error('Please provide a base64 image string');
    }

    // Directly upload the base64 string to Cloudinary
    // This bypasses the need for "Upload Presets"
    const result = await cloudinary.uploader.upload(image, {
      folder: 'devcollab',
    });

    res.status(200).json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};
