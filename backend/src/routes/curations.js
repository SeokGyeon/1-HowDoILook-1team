import express from "express";
const router = express.Router({ mergeParams: true });
import {
  getCurations,
  createCuration,
  updateCuration,
  deleteCuration,
} from "../controllers/curationController.js";

// 큐레이션 목록 조회
router.get("/", getCurations);

// 큐레이션 등록
router.post("/", createCuration);

// 큐레이션 수정
router.put("/:curationId", updateCuration);

// 큐레이션 삭제
router.delete("/:curationId", deleteCuration);

export default router;

/**
 * @swagger
 * tags:
 *   name: Curations
 *   description: 큐레이션 관리 API
 */

/**
 * @swagger
 * /api/styles/{styleId}/curations:
 *   get:
 *     summary: 특정 스타일의 큐레이션 목록 조회
 *     tags: [Curations]
 *     parameters:
 *       - in: path
 *         name: styleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 큐레이션을 조회할 스타일 ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 5
 *         description: 페이지당 아이템 수
 *       - in: query
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [nickname, content]
 *         description: 검색 기준 (닉네임 또는 내용)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *     responses:
 *       200:
 *         description: 큐레이션 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalItemCount:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nickname:
 *                         type: string
 *                       content:
 *                         type: string
 *                       trendy:
 *                         type: integer
 *                       personality:
 *                         type: integer
 *                       practicality:
 *                         type: integer
 *                       costEffectiveness:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       comment:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nickname:
 *                             type: string
 *                           content:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: Bad Request (잘못된 쿼리 파라미터)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다"
 *       404:
 *         description: Not Found (스타일을 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않습니다"
 *   post:
 *     summary: 스타일에 새 큐레이션 등록
 *     tags: [Curations]
 *     parameters:
 *       - in: path
 *         name: styleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 큐레이션을 등록할 스타일 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - content
 *               - password
 *               - trendy
 *               - personality
 *               - practicality
 *               - costEffectiveness
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 큐레이션 작성자 닉네임
 *               content:
 *                 type: string
 *                 description: 큐레이션 내용
 *               password:
 *                 type: string
 *                 description: 큐레이션 비밀번호
 *               trendy:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *                 description: 트렌디 점수 (0-10)
 *               personality:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *                 description: 개성 점수 (0-10)
 *               practicality:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *                 description: 실용성 점수 (0-10)
 *               costEffectiveness:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *                 description: 가성비 점수 (0-10)
 *     responses:
 *       200:
 *         description: 큐레이션 등록 성공
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
 *                 trendy:
 *                   type: integer
 *                 personality:
 *                   type: integer
 *                 practicality:
 *                   type: integer
 *                 costEffectiveness:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad Request (필수 필드 누락, 점수 범위 초과 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다"
 *       404:
 *         description: Not Found (스타일을 찾을 수 없음)
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
 * /api/styles/{styleId}/curations/{curationId}:
 *   put:
 *     summary: 큐레이션 수정
 *     tags: [Curations]
 *     parameters:
 *       - in: path
 *         name: styleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 스타일 ID
 *       - in: path
 *         name: curationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 큐레이션 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - password
 *               - trendy
 *               - personality
 *               - practicality
 *               - costEffectiveness
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 큐레이션 내용
 *               password:
 *                 type: string
 *                 description: 큐레이션 비밀번호
 *               trendy:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *                 description: 트렌디 점수 (0-10)
 *               personality:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *                 description: 개성 점수 (0-10)
 *               practicality:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *                 description: 실용성 점수 (0-10)
 *               costEffectiveness:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *                 description: 가성비 점수 (0-10)
 *     responses:
 *       200:
 *         description: 큐레이션 수정 성공
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
 *                 trendy:
 *                   type: integer
 *                 personality:
 *                   type: integer
 *                 practicality:
 *                   type: integer
 *                 costEffectiveness:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad Request (필수 필드 누락, 점수 범위 초과 등)
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
 *         description: Not Found (큐레이션이나 스타일을 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않습니다"
 *   delete:
 *     summary: 큐레이션 삭제
 *     tags: [Curations]
 *     parameters:
 *       - in: path
 *         name: styleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 스타일 ID
 *       - in: path
 *         name: curationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 큐레이션 ID
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
 *                 description: 큐레이션 비밀번호
 *     responses:
 *       200:
 *         description: 큐레이션 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "큐레이팅 삭제 성공"
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
 *         description: Not Found (큐레이션이나 스타일을 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않습니다"
 */