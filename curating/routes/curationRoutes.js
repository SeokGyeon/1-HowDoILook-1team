import express from "express";
import {
  getCurations,
  createCuration,
  updateCuration,
  deleteCuration,
} from "../controllers/curationController.js";

const router = express.Router();

router.get("/curations", getCurations); // 큐레이션 조회
router.post("/curations", createCuration); // 큐레이션 등록
router.put("/curations/:id", updateCuration); // 큐레이션 수정
router.delete("/curations/:id", deleteCuration); // 큐레이션 삭제

export default router;
