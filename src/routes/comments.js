import express from "express";
const router = express.Router();
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "../controllers/commentController.js";

// 답글 등록
router.post("/curations/:curationId/comments", createComment);

// 답글 수정
router.put("/comments/:commentId", updateComment);

// 답글 삭제
router.delete("/comments/:commentId", deleteComment);

// 답글 목록 조회
router.get("/curations/:curationId/comments", getComments);

export default router;
