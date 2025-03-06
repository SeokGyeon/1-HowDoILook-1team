import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./curating/.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoDB 연결 성공");
  } catch (error) {
    console.error("mongoDB 연결 실패:", error.message);
    process.exit(1);
  }
};

export default connectDB;
