import tagService from "../services/tagService.js";

export const getPopularTags = async (req, res) => {
  try {
    const popularTags = await tagService.getPopularTags();
    res.json(popularTags); // 인기 태그를 JSON 형식으로 반환
  } catch (error) {
    res.status(500).json({ error: error.message }); // 오류 발생 시 500 상태 코드와 메시지 반환
  }
};
