const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  type: { type: String, required: true }, //유효성 검사
  name: { type: String, required: true },
  brand: String,
  price: Number,
});

const StyleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  content: String,
  imageUrl: String,
  thumbnail: String,
  tags: [String],
  nickname: { type: String, required: true },
  passwd: { type: String, required: [true, "비밀번호를 입력해 주세요."] },
  viewCount: { type: Number, default: 0 },
  curationCount: { type: Number, default: 0 },
  trendy: { type: Number, default: 0 },
  personality: { type: Number, default: 0 },
  practicality: { type: Number, default: 0 },
  costEffectiveness: { type: Number, default: 0 },
  categories: [CategorySchema],
  createdAt: { type: Date, default: Date.now },
});

StyleSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model('Style', StyleSchema); 