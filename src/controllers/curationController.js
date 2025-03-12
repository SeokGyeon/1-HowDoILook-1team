import prisma from "../config/database.js";
import bcrypt from "bcrypt";

// 큐레이션 등록
export const createCuration = async (req, res, next) => {
  try {
    const { nickname, password, content, scores } = req.body;
    const { styleId } = req.params;

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 큐레이션 생성
    const curation = await prisma.curation.create({
      data: {
        nickname,
        password: hashedPassword,
        content,
        scores,
        styleId: Number(styleId),
      },
    });

    // 스타일의 큐레이션 카운트 증가
    await prisma.style.update({
      where: { id: Number(styleId) },
      data: { curationCount: { increment: 1 } },
    });

    res.status(201).json({
      success: true,
      data: curation,
    });
  } catch (error) {
    next(error);
  }
};

// 큐레이션 목록 조회
export const getCurations = async (req, res, next) => {
  const { styleId, page = 1, pageSize = 10, searchBy, keyword } = req.query;
  const query = {};

  if (styleId) query.styleId = Number(styleId);
  if (searchBy && keyword) {
    query[searchBy] = {
      contains: keyword, // Prisma에서 문자열 필터링 시 사용
      mode: "insensitive",
    };
  }

  try {
    const skip = (page - 1) * pageSize;

    const curations = await prisma.curation.findMany({
      where: query,
      skip: skip,
      take: Number(pageSize),
    });

    const totalCurations = await prisma.curation.count({
      where: query,
    });

    res.status(200).json({
      success: true,
      data: curations,
      pagination: {
        currentPage: page,
        pageSize: Number(pageSize),
        totalItems: totalCurations,
        totalPages: Math.ceil(totalCurations / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// 큐레이션 수정
export const updateCuration = async (req, res, next) => {
  const { id } = req.params;
  const { passwd, ...updateFields } = req.body;

  try {
    const curation = await prisma.curation.findUnique({
      where: { id: Number(id) },
    });

    if (!curation) {
      const error = new Error("큐레이션을 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    const isPasswordCorrect = await bcrypt.compare(passwd, curation.password);
    if (!isPasswordCorrect) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.status = 401;
      return next(error);
    }

    const updatedCuration = await prisma.curation.update({
      where: { id: Number(id) },
      data: { ...updateFields },
    });

    res.status(200).json({
      success: true,
      data: updatedCuration,
    });
  } catch (error) {
    next(error);
  }
};

// 큐레이션 삭제
export const deleteCuration = async (req, res, next) => {
  const { id } = req.params;
  const { passwd } = req.body;

  try {
    const curation = await prisma.curation.findUnique({
      where: { id: Number(id) },
    });

    if (!curation) {
      const error = new Error("큐레이션을 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    const isPasswordCorrect = await bcrypt.compare(passwd, curation.password);
    if (!isPasswordCorrect) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.status = 401;
      return next(error);
    }

    // 스타일의 큐레이션 카운트 감소
    await prisma.style.update({
      where: { id: curation.styleId },
      data: { curationCount: { decrement: 1 } },
    });

    await prisma.curation.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      success: true,
      message: "큐레이션이 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};
