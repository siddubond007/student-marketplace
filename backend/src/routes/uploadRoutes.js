const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { requireAuth } = require('../middlewares/authMiddleware');

// Temporary disk storage before streaming to Cloudinary
const tempDir = path.join(__dirname, '../../uploads_temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const cleanExt = path.extname(file.originalname) || '.png';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${cleanExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Upload Endpoint: Automatically organizes uploads into user-specific Cloudinary folders
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    // 1. Create a clean, dedicated folder slug for this user
    const userFolderSlug = (req.user?.username || req.user?.email?.split('@')[0] || req.user?.id || 'general_user')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    
    // Dedicated Cloudinary folder path (e.g. "skilllaunch_users/a_a")
    const userCloudinaryFolder = `skilllaunch_users/${userFolderSlug}`;
    console.log(`📁 Streaming upload for ${req.user?.email} -> Cloudinary folder: [${userCloudinaryFolder}]`);

    // 2. If base64 data was sent in JSON body (e.g. Cropped avatars or cover banners)
    if (req.body && req.body.base64Data) {
      const uploadRes = await cloudinary.uploader.upload(req.body.base64Data, {
        folder: userCloudinaryFolder,
        resource_type: 'auto'
      });
      console.log(`✅ Saved to Cloudinary: ${uploadRes.secure_url}`);
      return res.json({ url: uploadRes.secure_url });
    }

    // 3. If file was sent via Multipart Form (e.g. Student ID Card / Govt ID / Portfolio)
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided for upload.' });
    }

    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: userCloudinaryFolder,
      resource_type: 'auto'
    });

    // Clean up temporary local disk file immediately after Cloudinary upload
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (cleanupErr) {
      console.warn('Temp file cleanup warning:', cleanupErr);
    }

    console.log(`✅ Saved to Cloudinary: ${uploadRes.secure_url}`);
    return res.json({ url: uploadRes.secure_url });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    const errorMessage = err?.message || err?.error?.message || JSON.stringify(err);
    res.status(500).json({ error: 'Cloudinary upload failed: ' + errorMessage });
  }
});

module.exports = router;
