const express = require('express');
const router = express.Router();
const {
    createComment,
    updateComment,
    deleteComment,
    getComments
} = require('../controllers/commentController');

// 답글 등록
router.post('/curations/:curationId/comments', createComment);

// 답글 수정
router.put('/comments/:commentId', updateComment);

// 답글 삭제
router.delete('/comments/:commentId', deleteComment);

// 답글 목록 조회
router.get('/curations/:curationId/comments', getComments);

module.exports = router; 