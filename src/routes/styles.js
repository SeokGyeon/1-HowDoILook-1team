const express = require('express');
const router = express.Router();
const {
  getStyleRankings,
  createStyle,
  getStyles,
  updateStyle,
  deleteStyle,
  getStyleById
} = require('../controllers/styleController');

// 스타일 등록
router.post('/', createStyle);

// 스타일 목록 조회
router.get('/', getStyles);

// 스타일 상세 조회
router.get('/:id', getStyleById);

// 스타일 수정
router.patch('/:id', updateStyle);

// 스타일 삭제
router.delete('/:id', deleteStyle);

// 스타일 랭킹 조회
router.get('/rankings', getStyleRankings);

module.exports = router; 