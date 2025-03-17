import prisma from "../config/database.js";
import bcrypt from "bcrypt";

// 큐레이션 등록
export const createCuration = async (req, res, next) => {
  try {
    const { nickname, password, content, trendy, personality, practicality, costEffectiveness } = req.body;
    const { styleId } = req.params;

    // 필수 필드 검증
    if (!nickname || !password || !content || 
        trendy === undefined || personality === undefined || 
        practicality === undefined || costEffectiveness === undefined) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 점수 유효성 검증 (0-10 사이의 숫자)
    const scores = { trendy, personality, practicality, costEffectiveness };
    if (!Object.values(scores).every(score => 
        typeof score === 'number' && score >= 0 && score <= 10)) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 큐레이션 생성
    const curation = await prisma.curation.create({
      data: {
        nickname,
        password: hashedPassword,
        content,
        trendy,
        personality,
        practicality,
        costEffectiveness,
        styleId: Number(styleId),
      },
      select: {
        id: true,
        nickname: true,
        content: true,
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true,
        createdAt: true
      }
    });

    // 스타일의 큐레이션 카운트 증가
    await prisma.style.update({
      where: { id: Number(styleId) },
      data: { curationCount: { increment: 1 } },
    });

    res.status(200).json(curation);
  } catch (error) {
    next(error);
  }
};

// 큐레이션 목록 조회
export const getCurations = async (req, res, next) => {
  try {
    const { searchBy, keyword, page = 1, pageSize = 10 } = req.query;
    const { styleId } = req.params;

    // styleId 유효성 검증
    if (!styleId || isNaN(Number(styleId))) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 검색 조건 설정
    const where = {
      styleId: Number(styleId)
    };

    // searchBy 유효성 검증 및 검색 조건 추가
    if (keyword) {
      if (!['nickname', 'content'].includes(searchBy)) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
      }
      where[searchBy] = {
        contains: keyword,
        mode: 'insensitive'
      };
    }

    const skip = (Number(page) - 1) * Number(pageSize);

    const [curations, totalCount] = await Promise.all([
      prisma.curation.findMany({
        where,
        skip,
        take: Number(pageSize),
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          nickname: true,
          content: true,
          trendy: true,
          personality: true,
          practicality: true,
          costEffectiveness: true,
          createdAt: true,
          comments: {
            select: {
              id: true,
              nickname: true,
              content: true,
              createdAt: true
            },
            take: 1,
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      }),
      prisma.curation.count({ where })
    ]);

    // 응답 데이터 구조화
    const formattedCurations = curations.map(curation => ({
      ...curation,
      comment: curation.comments[0] || {}
    }));

    const totalPages = Math.ceil(totalCount / Number(pageSize));

    res.json({
      currentPage: Number(page),
      totalPages,
      totalItemCount: totalCount,
      data: formattedCurations.map(({ comments, ...rest }) => rest)
    });
  } catch (error) {
    next(error);
  }
};

// 큐레이션 수정
export const updateCuration = async (req, res, next) => {
  try {
    const { curationId } = req.params;
    const { password, content, trendy, personality, practicality, costEffectiveness } = req.body;

    // ID 유효성 검증
    if (!curationId || isNaN(Number(curationId))) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 필수 필드 검증
    if (!password || !content || 
        trendy === undefined || personality === undefined || 
        practicality === undefined || costEffectiveness === undefined) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 점수 유효성 검증 (0-10 사이의 숫자)
    const scores = { trendy, personality, practicality, costEffectiveness };
    if (!Object.values(scores).every(score => 
        typeof score === 'number' && score >= 0 && score <= 10)) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    const curation = await prisma.curation.findUnique({
      where: { id: Number(curationId) }
    });

    if (!curation) {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, curation.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    }

    const updatedCuration = await prisma.curation.update({
      where: { id: Number(curationId) },
      data: {
        content,
        trendy,
        personality,
        practicality,
        costEffectiveness
      },
      select: {
        id: true,
        nickname: true,
        content: true,
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true,
        createdAt: true
      }
    });

    res.json(updatedCuration);
  } catch (error) {
    next(error);
  }
};

// 큐레이션 삭제
export const deleteCuration = async (req, res, next) => {
  try {
    const { curationId } = req.params;
    const { password } = req.body;

    // ID 유효성 검증
    if (!curationId || isNaN(Number(curationId))) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 비밀번호 필수 검증
    if (!password) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    const curation = await prisma.curation.findUnique({
      where: { id: Number(curationId) }
    });

    if (!curation) {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, curation.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    }

    // 스타일의 큐레이션 카운트 감소
    await prisma.style.update({
      where: { id: curation.styleId },
      data: { curationCount: { decrement: 1 } }
    });

    await prisma.curation.delete({
      where: { id: Number(curationId) }
    });

    res.json({ message: "큐레이팅 삭제 성공" });
  } catch (error) {
    next(error);
  }
};
