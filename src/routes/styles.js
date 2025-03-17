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

// 스타일 랭킹 조회
router.get("/rankings", getStyleRankings);

// 스타일 등록
router.post("/", createStyle);

// 스타일 목록 조회
router.get("/", getStyles);

// 스타일 상세 조회
router.get("/:id", getStyleById);

// 스타일 수정
router.put("/:id", updateStyle);

// 스타일 삭제
router.delete("/:id", deleteStyle);



export default router;

/**
 * @swagger
 * tags:
 *   name: Styles
 *   description: 스타일 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         brand:
 *           type: string
 *         price:
 *           type: integer
 *     Categories:
 *       type: object
 *       properties:
 *         top:
 *           $ref: '#/components/schemas/Category'
 *         bottom:
 *           $ref: '#/components/schemas/Category'
 *     StyleInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nickname:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         viewCount:
 *           type: integer
 *         curationCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         categories:
 *           $ref: '#/components/schemas/Categories'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         imageUrls:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/styles/rankings:
 *   get:
 *     summary: 스타일 랭킹 목록 조회
 *     tags: [Styles]
 *     parameters:
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
 *           default: 10
 *         description: 페이지당 아이템 수
 *       - in: query
 *         name: rankBy
 *         schema:
 *           type: string
 *           enum: [total, trendy, personality, "practicality, costEffectiveness"]
 *           default: total
 *         description: 랭킹 기준 (total | trendy | personality | practicality, costEffectiveness)
 *     responses:
 *       200:
 *         description: 스타일 랭킹 목록 조회 성공
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
 *                       thumbnail:
 *                         type: string
 *                       nickname:
 *                         type: string
 *                       title:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       categories:
 *                         $ref: '#/components/schemas/Categories'
 *                       viewCount:
 *                         type: integer
 *                       curationCount:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       ranking:
 *                         type: integer
 *                       rating:
 *                         type: number
 *                         format: float
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
 */

/**
 * @swagger
 * /api/styles:
 *   get:
 *     summary: 스타일 목록 조회 (갤러리)
 *     tags: [Styles]
 *     parameters:
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
 *           default: 10
 *         description: 페이지당 아이템 수
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [latest, mostViewed, mostCurated]
 *           default: latest
 *         description: 정렬 기준
 *       - in: query
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [nickname, title, content, tag]
 *         description: 검색 기준
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색어
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: 필터링할 태그
 *     responses:
 *       200:
 *         description: 스타일 목록 조회 성공
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
 *                       thumbnail:
 *                         type: string
 *                       nickname:
 *                         type: string
 *                       title:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       categories:
 *                         $ref: '#/components/schemas/Categories'
 *                       content:
 *                         type: string
 *                       viewCount:
 *                         type: integer
 *                       curationCount:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
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
 *   post:
 *     summary: 새로운 스타일 등록
 *     tags: [Styles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - title
 *               - content
 *               - password
 *               - imageUrls
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 작성자 닉네임
 *               title:
 *                 type: string
 *                 description: 스타일 제목
 *               content:
 *                 type: string
 *                 description: 스타일 내용
 *               password:
 *                 type: string
 *                 description: 스타일 비밀번호 (수정/삭제시 필요)
 *               categories:
 *                 $ref: '#/components/schemas/Categories'
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 스타일 태그 목록
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 이미지 URL 목록
 *     responses:
 *       201:
 *         description: 스타일 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StyleInfo'
 *       400:
 *         description: Bad Request (필수 필드 누락 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다"
 */

/**
 * @swagger
 * /api/styles/{id}:
 *   get:
 *     summary: 특정 스타일 상세 조회
 *     tags: [Styles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 스타일 ID
 *     responses:
 *       200:
 *         description: 스타일 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StyleInfo'
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
 *   put:
 *     summary: 스타일 수정
 *     tags: [Styles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 스타일 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: 작성자 닉네임
 *               title:
 *                 type: string
 *                 description: 스타일 제목
 *               content:
 *                 type: string
 *                 description: 스타일 내용
 *               password:
 *                 type: string
 *                 description: 스타일 작성시 설정한 비밀번호
 *               categories:
 *                 $ref: '#/components/schemas/Categories'
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 스타일 태그 목록
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 이미지 URL 목록
 *     responses:
 *       200:
 *         description: 스타일 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StyleInfo'
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
 *         description: Not Found (스타일을 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않습니다"
 *   delete:
 *     summary: 스타일 삭제
 *     tags: [Styles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 스타일 ID
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
 *                 description: 스타일 작성시 설정한 비밀번호
 *     responses:
 *       200:
 *         description: 스타일 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "스타일 삭제 성공"
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