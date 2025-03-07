const mongoose = require('mongoose');

const CurationSchema = new mongoose.Schema({
  nickname: { type: String, required: [true, "닉네임을 입력해 주세요."] },
  passwd: { type: String, required: [true, "비밀번호를 입력해 주세요."] },
  content: { type: String, required: [true, "큐레이팅 내용을 작성해 주세요."] },
  trendy: { type: Number, default: 0 },
  personality: { type: Number, default: 0 },
  practicality: { type: Number, default: 0 },
  costEffectiveness: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  styleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Style', required: true }
});

module.exports = mongoose.model('Curation', CurationSchema); 