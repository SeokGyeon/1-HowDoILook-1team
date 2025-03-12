import express from "express";
import {
  getStyleRankings,
  createStyle,
  getStyles,
  updateStyle,
  deleteStyle,
  getRanking,
} from "../controllers/styleController.js";

const router = express.Router();

// 스타일 등록
router.post("/", createStyle);

// 스타일 목록 조회
router.get("/", getStyles);

// 스타일 수정
router.patch("/:id", updateStyle);

// 스타일 삭제
router.delete("/:id", deleteStyle);

// 스타일 랭킹 타입
router.get("/ranking/:type", getRanking);

// 스타일 랭킹 조회
router.get("/rankings", getStyleRankings);

export default router;
