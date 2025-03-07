const express = require('express');
const router = express.Router();
const {
  getCurations,
  createCuration,
  updateCuration,
  deleteCuration,
} = require('../controllers/curationController');

// 큐레이션 등록
router.post('/styles/:styleId/curations', createCuration);

// 큐레이션 목록 조회
router.get('/styles/:styleId/curations', getCurations);

// 큐레이션 수정
router.put('/:curationId', updateCuration);

// 큐레이션 삭제
router.delete('/:curationId', deleteCuration);

module.exports = router; 