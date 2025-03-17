import express from "express";
import prisma from '../config/database.js';

const router = express.Router();

import { getPopularTags } from "../controllers/tagController.js";

router.get("/", async (req, res) => {
    try {
      const tags = await prisma.tag.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      res.json({
        success: true,
        tags
      });
    } catch (error) {
      console.error('태그 조회 에러:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });



// 인기 태그 목록 조회
router.get("/popular", getPopularTags);

export default router;

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: 태그 관리 API
 */

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: 모든 태그 조회
 *     tags: [Tags]
 *     description: 전체 태그 목록을 조회합니다
 *     responses:
 *       200:
 *         description: 태그 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
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
 * /api/tags/popular:
 *   get:
 *     summary: 인기 태그 목록 조회
 *     tags: [Tags]
 *     description: 가장 많이 사용된 인기 태그 목록을 조회합니다
 *     responses:
 *       200:
 *         description: 인기 태그 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       count:
 *                         type: integer
 *                         description: 태그가 사용된 횟수
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