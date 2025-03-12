import express from "express";
const router = express.Router();
import {
  getStyleRankings,
  createStyle,
  getStyles,
  updateStyle,
  deleteStyle,
  getStyleById,
} from "../controllers/styleController.js";

// 스타일 등록
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
router.get("/rankings", getStyleRankings);

export default router;
