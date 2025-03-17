import prisma from "../config/database.js";

const getPopularTags = async () => {
  try {
    // 태그별 사용 횟수를 계산하여 인기 태그를 가져옴
    const popularTags = await prisma.$queryRaw`
      SELECT t.id, t.name, COUNT(s.id) as count 
      FROM Tag t
      JOIN _StyleToTag st ON t.id = st.B
      JOIN Style s ON st.A = s.id
      GROUP BY t.id, t.name
      ORDER BY count DESC
      LIMIT 10
    `;
    
    return {
      success: true,
      tags: popularTags
    };
  } catch (error) {
    throw new Error(
      `인기 태그를 가져오는 중 오류가 발생했습니다: ${error.message}`
    );
  }
};

export default {
  getPopularTags,
};
