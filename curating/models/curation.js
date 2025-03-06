import mongoose from "mongoose";

const CurationSchema = new mongoose.Schema({
  nickname: { type: String, required: [true, "닉네임을 입력해 주세요."] }, //사용자 닉네임
  passwd: { type: String, required: [true, "비밀번호를 입력해 주세요."] }, //사용자 비밀번호
  content: { type: String, required: [true, "큐레이팅 내용을 작성해 주세요."] }, //큐레이팅 한줄 평
  trendy: { type: Number, default: 0 }, //트렌디 점수
  personality: { type: Number, default: 0 }, //개성 점수
  practicality: { type: Number, default: 0 }, //실용성 점수
  costEffectiveness: { type: Number, default: 0 }, //가성비 점수
  createdAt: { type: Date, default: Date.now }, //생성 날짜
});

const Curation = mongoose.model("curation", CurationSchema);
export default Curation;
