require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// 보안 미들웨어
app.use(helmet());

// CORS 설정
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 로깅 미들웨어
app.use(morgan('dev'));

// 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 설정
app.use('/images', express.static(path.join(__dirname, 'images')));

// 데이터베이스 연결
connectDB();

// API 라우터
app.use('/api/styles', require('./src/routes/styles'));
app.use('/api/curations', require('./src/routes/curations'));
app.use('/api/comments', require('./src/routes/comments'));
app.use('/api/tags', require('./src/routes/tags'));
app.use('/api/images', require('./src/routes/images'));

// 에러 핸들링 미들웨어
app.use(errorHandler);

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청하신 리소스를 찾을 수 없습니다.'
  });
});

const PORT = process.env.PORT || 4000; // 프론트엔드와 포트 충돌 방지
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 