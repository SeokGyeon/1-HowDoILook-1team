const Comment = require('../models/Comment');
const Curation = require('../models/Curation');
const bcrypt = require('bcrypt');

// 답글 등록
exports.createComment = async (req, res, next) => {
    try {
        const { content, nickname, passwd } = req.body;
        const { curationId } = req.params;
        
        const comment = await Comment.create({
            content,
            nickname,
            passwd,
            curationId
        });

        res.status(201).json({
            success: true,
            data: {
                id: comment._id,
                content: comment.content,
                nickname: comment.nickname,
                createdAt: comment.createdAt
            }
        });
    } catch (error) {
        if (error.code === 11000) {  // duplicate key error
            const err = new Error('이미 답글이 존재합니다');
            err.status = 400;
            return next(err);
        }
        next(error);
    }
};

// 답글 수정
exports.updateComment = async (req, res, next) => {
    try {
        const { content, passwd } = req.body;
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            const error = new Error('답글을 찾을 수 없습니다');
            error.status = 404;
            return next(error);
        }

        // 비밀번호 확인
        if (passwd !== comment.passwd) {
            const error = new Error('비밀번호가 일치하지 않습니다');
            error.status = 401;
            return next(error);
        }

        comment.content = content;
        await comment.save();

        res.json({
            success: true,
            data: {
                id: comment._id,
                content: comment.content,
                nickname: comment.nickname,
                createdAt: comment.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// 답글 삭제
exports.deleteComment = async (req, res, next) => {
    try {
        const { passwd } = req.body;
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            const error = new Error('답글을 찾을 수 없습니다');
            error.status = 404;
            return next(error);
        }

        // 비밀번호 확인
        if (passwd !== comment.passwd) {
            const error = new Error('비밀번호가 일치하지 않습니다');
            error.status = 401;
            return next(error);
        }

        await comment.deleteOne();

        res.json({
            success: true,
            message: '답글이 삭제되었습니다'
        });
    } catch (error) {
        next(error);
    }
};

// 답글 목록 조회
exports.getComments = async (req, res, next) => {
    try {
        const { curationId } = req.params;
        
        const comments = await Comment.find({ curationId })
            .select('content nickname createdAt')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: comments
        });
    } catch (error) {
        next(error);
    }
}; 