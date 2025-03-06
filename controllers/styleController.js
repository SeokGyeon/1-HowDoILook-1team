import Style from "../models/style.js";
import { errorHandler } from "../middlewares/errorHandler.js";

//검색 정렬
export const getStyles = errorHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { nickname: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const total = await Style.countDocuments(query);
  const styles = await Style.find(query)
    .sort({ [sortBy]: order === "desc" ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ total, page: Number(page), limit: Number(limit), styles });
});

//랭킹
export const getStyleRankings = errorHandler(async (req, res) => {
  const { sortBy = "curationCount", page = 1, limit = 10 } = req.query;

  const validSortFields = [
    "trendy",
    "personality",
    "practicality",
    "costEffectiveness",
    "viewCount",
    "curationCount",
  ];
  if (!validSortFields.includes(sortBy)) {
    return res.status(400).json({ error: "잘못된 요청" });
  }

  const total = await Style.countDocuments();
  const styles = await Style.find()
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ total, page: Number(page), limit: Number(limit), styles });
});

//조회
export const getStyleById = errorHandler(async (req, res) => {
  const { id } = req.params;
  const style = await Style.findByIdAndUpdate(
    id,
    { $inc: { viewCount: 1 } },
    { new: true }
  );

  if (!style)
    return res.status(404).json({ error: "스타일을 찾을 수 없습니다." });

  res.json(style);
});

//생성
export const createStyle = errorHandler(async (req, res) => {
  const style = new Style(req.body);
  await style.save();
  res.status(201).json(style);
});

//업데이트
export const updateStyle = errorHandler(async (req, res) => {
  const { id } = req.params;
  const updatedStyle = await Style.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedStyle);
});

//삭제
export const deleteStyle = errorHandler(async (req, res) => {
  const { id } = req.params;
  await Style.findByIdAndDelete(id);
  res.status(204).send();
});

// 스타일 상세 조회
export const getStyleDetail = errorHandler(async (req, res) => {
  const { id } = req.params;

  //조회수 증가
  const style = await Style.findByIdAndUpdate(
    id,
    { $inc: { viewCount: 1 } },
    { new: true }
  );

  if (!style) {
    return res.status(404).json({ error: "스타일을 찾을 수 없습니다." });
  }

  res.json(style);
});
