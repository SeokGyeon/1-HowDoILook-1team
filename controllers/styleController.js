import Style from "../models/style.js";

//검색 정렬
export const getStyles = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

//랭킹
export const getStyleRankings = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

//조회
export const getStyleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const style = await Style.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!style)
      return res.status(404).json({ error: "스타일을 찾을 수 없습니다." });

    res.json(style);
  } catch (error) {
    next(error);
  }
};

//생성
export const createStyle = async (req, res, next) => {
  try {
    const style = new Style(req.body);
    await style.save();
    res.status(201).json(style);
  } catch (error) {
    next(error);
  }
};

//업데이트
export const updateStyle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedStyle = await Style.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updatedStyle);
  } catch (error) {
    next(error);
  }
};

//삭제
export const deleteStyle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Style.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// 스타일 상세 조회
export const getStyleDetail = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
