const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Public
router.post('/single', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        path: req.file.path,
        url: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Public
router.post('/multiple', upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload files'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      url: `/uploads/${file.filename}`
    }));

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
