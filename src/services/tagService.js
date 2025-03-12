import prisma from "../config/database.js"; // Prisma 데이터베이스 연결

const getPopularTags = async () => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        count: "desc", // count를 기준으로 내림차순 정렬하여 인기 태그를 가져옵니다.
      },
      take: 10, // 인기 태그 상위 10개만 가져옵니다.
    });
    return tags;
  } catch (error) {
    throw new Error(
      `인기 태그를 가져오는 중 오류가 발생했습니다: ${error.message}`
    );
  }
};

export default {
  getPopularTags,
};
