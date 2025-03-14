import express from "express";
const router = express.Router({ mergeParams: true });
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "../controllers/commentController.js";

// 답글 등록
router.post("/", createComment);

// 답글 수정
router.put("/:commentId", updateComment);

// 답글 삭제
router.delete("/:commentId", deleteComment);

// 답글 목록 조회
router.get("/", getComments);

export default router;

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 관리 API
 */

/**
 * @swagger
 * /api/curations/{curationId}/comments:
 *   post:
 *     summary: 큐레이션에 새 답글 작성
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: curationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 답글을 작성할 큐레이션 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - password
 *             properties:
 *               content:
 *                 type: string
 *                 description: 답글 내용
 *               password:
 *                 type: string
 *                 description: 스타일 작성자 비밀번호 (스타일 비밀번호와 일치해야 함)
 *     responses:
 *       200:
 *         description: 답글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nickname:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad Request (필수 필드 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다"
 *       404:
 *         description: Not Found (큐레이션 또는 스타일을 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않습니다"
 *   get:
 *     summary: 큐레이션의 답글 목록 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: curationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 답글을 조회할 큐레이션 ID
 *     responses:
 *       200:
 *         description: 답글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nickname:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Not Found (큐레이션을 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않습니다"
 */

/**
 * @swagger
 * /api/comments/{commentId}:
 *   put:
 *     summary: 답글 수정
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 답글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - password
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 답글 내용
 *               password:
 *                 type: string
 *                 description: 답글 작성 시 설정한 비밀번호
 *     responses:
 *       200:
 *         description: 답글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nickname:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad Request (필수 필드 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다"
 *       403:
 *         description: Forbidden (비밀번호 불일치)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "비밀번호가 틀렸습니다"
 *       404:
 *         description: Not Found (답글을 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않습니다"
 *   delete:
 *     summary: 답글 삭제
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 답글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: 답글 작성 시 설정한 비밀번호
 *     responses:
 *       200:
 *         description: 답글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "답글 삭제 성공"
 *       400:
 *         description: Bad Request (필수 필드 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다"
 *       403:
 *         description: Forbidden (비밀번호 불일치)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "비밀번호가 틀렸습니다"
 *       404:
 *         description: Not Found (답글을 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않습니다"
 */
