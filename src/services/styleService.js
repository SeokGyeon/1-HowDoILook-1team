import prisma from "../config/prismaClient.js";

// 스타일 목록 조회
const getStyles = async ({
  page = 1,
  pageSize = 10,
  searchBy,
  keyword,
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const query = {};

  if (searchBy && keyword) {
    query[searchBy] = {
      contains: keyword,
      mode: "insensitive",
    };
  }

  const skip = (page - 1) * pageSize;
  const styles = await prisma.style.findMany({
    where: query,
    skip,
    take: Number(pageSize),
    orderBy: { [sortBy]: sortOrder },
  });

  const totalStyles = await prisma.style.count({ where: query });

  return {
    styles,
    pagination: {
      currentPage: page,
      pageSize: Number(pageSize),
      totalItems: totalStyles,
      totalPages: Math.ceil(totalStyles / pageSize),
    },
  };
};

// 스타일 상세 조회
const getStyleById = async (id) => {
  const style = await prisma.style.findUnique({ where: { id: Number(id) } });
  if (!style) {
    const error = new Error("해당 스타일을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  return style;
};

// 스타일 등록
const createStyle = async (styleData) => {
  return await prisma.style.create({ data: styleData });
};

// 스타일 수정
const updateStyle = async (id, updateFields, passwd) => {
  const style = await prisma.style.findUnique({ where: { id: Number(id) } });

  if (!style) {
    const error = new Error("스타일을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  if (style.passwd !== passwd) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.status = 401;
    throw error;
  }

  return await prisma.style.update({
    where: { id: Number(id) },
    data: updateFields,
  });
};

// 스타일 삭제
const deleteStyle = async (id) => {
  const style = await prisma.style.findUnique({ where: { id: Number(id) } });

  if (!style) {
    const error = new Error("스타일을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  await prisma.style.delete({ where: { id: Number(id) } });

  return { message: "스타일이 삭제되었습니다." };
};

// 스타일 랭킹 조회
const getRanking = async (rankType, page = 1, pageSize = 10) => {
  let orderByCondition = {};

  switch (rankType) {
    case "trendy":
      orderByCondition = { trendingScore: "desc" };
      break;
    case "unique":
      orderByCondition = { uniquenessScore: "desc" };
      break;
    case "practical":
      orderByCondition = { practicalityScore: "desc" };
      break;
    case "budget":
      orderByCondition = { budgetScore: "desc" };
      break;
    default:
      orderByCondition = { totalLikes: "desc" };
  }

  const skip = (page - 1) * pageSize;
  const rankedStyles = await prisma.style.findMany({
    orderBy: orderByCondition,
    skip,
    take: Number(pageSize),
  });

  const totalStyles = await prisma.style.count();

  return {
    styles: rankedStyles,
    pagination: {
      currentPage: page,
      pageSize: Number(pageSize),
      totalItems: totalStyles,
      totalPages: Math.ceil(totalStyles / pageSize),
    },
  };
};

export {
  getStyles,
  getStyleById,
  createStyle,
  updateStyle,
  deleteStyle,
  getRanking,
};
