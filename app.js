import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import swaggerUi from 'swagger-ui-express';
import specs from './src/config/swagger.js';
import errorHandler from "./src/middlewares/errorHandler.js";
import loggerMiddleware from "./src/middlewares/loggerMiddleware.js";

dotenv.config();

const app = express();

// 보안 미들웨어
app.use(helmet({
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
}));

// CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// 모든 요청에 대해 상세 정보 로깅
app.use(loggerMiddleware);

// 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 설정
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// 라우터 모듈 동적 로드
const stylesRouter = (await import("./src/routes/styles.js")).default;
const curationsRouter = (await import("./src/routes/curations.js")).default;
const commentsRouter = (await import("./src/routes/comments.js")).default;
const tagsRouter = (await import("./src/routes/tags.js")).default;
const imagesRouter = (await import("./src/routes/images.js")).default;

// API 라우터 
app.use("/api/styles", stylesRouter);
app.use("/api/styles/:styleId/curations", curationsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/curations", curationsRouter);
app.use("/api/curations/:curationId/comments", commentsRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/images", imagesRouter);

// API 라우터 
app.use("/styles", stylesRouter);
app.use("/styles/:styleId/curations", curationsRouter);
app.use("/comments", commentsRouter);
app.use("/curations", curationsRouter);
app.use("/curations/:curationId/comments", commentsRouter);
app.use("/tags", tagsRouter);
app.use("/images", imagesRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
