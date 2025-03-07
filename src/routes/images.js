const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/imageController');

// 이미지 업로드
router.post('/upload', uploadImage);

module.exports = router; 