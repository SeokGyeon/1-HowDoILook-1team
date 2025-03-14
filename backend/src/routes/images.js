import express from "express";
import { uploadImage } from "../controllers/imageController.js";

const router = express.Router();

// 이미지 업로드
router.post("/", uploadImage, (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '이미지가 업로드되지 않았습니다.'
        });
      }
  
      const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
      res.json({
        success: true,
        imageUrl
      });
    } catch (error) {
      console.error('이미지 업로드 에러:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });

export default router;

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: 이미지 업로드 API
 */

/**
 * @swagger
 * /api/images:
 *   post:
 *     summary: 이미지 업로드
 *     tags: [Images]
 *     description: 스타일 이미지를 서버에 업로드합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일
 *     responses:
 *       200:
 *         description: 이미지 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 imageUrl:
 *                   type: string
 *                   example: "http://localhost:4000/uploads/image123.jpg"
 *       400:
 *         description: Bad Request (이미지 파일이 누락됨)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다"
 *       500:
 *         description: Internal Server Error (서버 오류)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 에러가 발생했습니다."
 */

/**
 * @swagger
 * /api/images/{id}:
 *   delete:
 *     summary: 이미지 삭제
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 이미지 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found (이미지를 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다"
 *       500:
 *         description: Internal Server Error (서버 오류)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 에러가 발생했습니다."
 */