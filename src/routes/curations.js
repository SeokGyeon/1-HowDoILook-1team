import express from "express";
const router = express.Router();
import {
  getCurations,
  createCuration,
  updateCuration,
  deleteCuration,
} from "../controllers/curationController.js";

// 큐레이션 등록
router.post("/styles/:styleId/curations", createCuration);

// 큐레이션 목록 조회
router.get("/styles/:styleId/curations", getCurations);

// 큐레이션 수정
router.put("/:curationId", updateCuration);

// 큐레이션 삭제
router.delete("/:curationId", deleteCuration);

export default router;
