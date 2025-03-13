import express from "express";
const router = express.Router();
import { uploadImage } from "../controllers/imageController.js";

// 이미지 업로드
router.post("/upload", uploadImage);

export default router;
