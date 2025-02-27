import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  type: String,
  name: String,
  brand: String,
  price: Number,
});

const StyleSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  content: String,
  imageUrl: String,
  thumbnail: String,
  tags: [String],
  nickname: String,
  viewCount: { type: Number, default: 0 },
  curationCount: { type: Number, default: 0 },
  categories: [CategorySchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Style", StyleSchema);
