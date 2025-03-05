import Style from "../models/style.js";

//정렬
export const getStyles = async (req, res) => {
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
            { title: { $regex: search, $options: "i" } }, //검색기능 ...
            { nickname: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const styles = await Style.find(query)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(styles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//랭킹
export const getStyleRankings = async (req, res) => {
  try {
    const { sortBy = "curationCount" } = req.query;

    const validSortFields = [
      "trendy",
      "personality",
      "practicality",
      "costEffectiveness",
      "viewCount",
      "curationCount",
    ];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: "Invalid sorting field" });
    }

    const styles = await Style.find()
      .sort({ [sortBy]: -1 })
      .limit(10);
    res.json(styles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//조회
export const getStyleById = async (req, res) => {
  try {
    const { id } = req.params;
    const style = await Style.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!style) return res.status(404).json({ error: "Style not found" });

    res.json(style);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//생성
export const createStyle = async (req, res) => {
  try {
    const style = new Style(req.body);
    await style.save();
    res.status(201).json(style);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//업데이트
export const updateStyle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStyle = await Style.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedStyle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//삭제
export const deleteStyle = async (req, res) => {
  try {
    const { id } = req.params;
    await Style.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 스타일 상세 조회
export const getStyleDetail = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};
