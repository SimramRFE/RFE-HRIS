const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// Upload documents for employee
router.post('/', protect, upload.array('documents', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const documents = req.files.map(file => ({
      name: file.originalname,
      url: `/uploads/documents/${file.filename}`,
      size: file.size,
      type: file.mimetype,
      uploadDate: new Date()
    }));

    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading documents',
      error: error.message
    });
  }
});

// Download/View document
router.get('/:filename', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads/documents', req.params.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving file',
      error: error.message
    });
  }
});

// Delete document
router.delete('/:filename', protect, (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads/documents', req.params.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
});

module.exports = router;
