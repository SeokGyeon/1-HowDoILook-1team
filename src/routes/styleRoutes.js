import express from "express";
import {
  createStyle,
  getStyles,
  getStyleById,
  updateStyle,
  deleteStyle,
  getRanking,
} from "../controllers/styleController.js";

const router = express.Router();

// 라우트가 불러와졌는지 확인하는 로그
console.log("styleRoutes.js 로드 완료");

// 스타일 생성
router.post("/", (req, res) => {
  console.log("POST /styles 요청 도착");
  createStyle(req, res);
});

// 스타일 생성
router.post("/", createStyle);

// 스타일 목록 조회
router.get("/", getStyles);

// 스타일 상세 조회
router.get("/:id", getStyleById);

// 스타일 수정
router.patch("/:id", updateStyle);

// 스타일 삭제
router.delete("/:id", deleteStyle);

// 스타일 랭킹 조회
router.get("/ranking/:type", getRanking);

export default router;
