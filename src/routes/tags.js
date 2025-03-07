const express = require('express');
const router = express.Router();
const { getPopularTags } = require('../controllers/tagController');

// 인기 태그 목록 조회
router.get('/popular-tags', getPopularTags);

module.exports = router; 