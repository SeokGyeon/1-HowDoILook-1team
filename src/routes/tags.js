import express from "express";
const router = express.Router();
import { getPopularTags } from "../controllers/tagController.js";

// 인기 태그 목록 조회
router.get("/popular-tags", getPopularTags);

export default router;
