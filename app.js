import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import errorHandler from "./src/middlewares/errorHandler.js";
import styleRoutes from "./src/routes/styles.js";
import curationRoutes from "./src/routes/curations.js";
import commentRoutes from "./src/routes/comments.js";
import tagRoutes from "./src/routes/tags.js";
import imageRoutes from "./src/routes/images.js";
dotenv.config();

const app = express();

// 보안 미들웨어
app.use(helmet());

// CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 로깅 미들웨어
app.use(morgan("dev"));

// 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 설정
app.use("/images", express.static(path.join(path.resolve(), "images")));

// API 라우터
app.use("/api/styles", styleRoutes);
app.use("/api/curations", curationRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/images", imageRoutes);

// 에러 핸들링 미들웨어
app.use(errorHandler);

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "요청하신 리소스를 찾을 수 없습니다.",
  });
});

const PORT = process.env.PORT || 4000; // 프론트엔드와 포트 충돌 방지
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
