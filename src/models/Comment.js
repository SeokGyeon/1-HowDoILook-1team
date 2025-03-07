const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, '내용을 입력해주세요'],
        maxLength: [150, '150자 이내로 작성해주세요']
    },
    nickname: {
        type: String,
        required: [true, '닉네임을 입력해주세요'],
        maxLength: [20, '20자 이내로 작성해주세요']
    },
    passwd: {
        type: String,
        required: [true, '비밀번호를 입력해주세요']
    },
    curationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curation',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 큐레이션당 하나의 답글만 허용하는 unique 인덱스
CommentSchema.index({ curationId: 1 }, { unique: true });

module.exports = mongoose.model('Comment', CommentSchema); 