import Style from "../models/style.js";

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
      return res.status(400).json({ error: "잘못된 필드" });
    }

    const styles = await Style.find()
      .sort({ [sortBy]: -1 })
      .limit(10);

    res.json(styles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//첨삭
export const createStyle = async (req, res) => {
  try {
    const style = new Style(req.body);
    await style.save();
    res.status(201).json(style);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStyles = async (req, res) => {
  try {
    const styles = await Style.find();
    res.json(styles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

export const deleteStyle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStyle = await Style.findByIdAndDelete(id);

    if (!deletedStyle) {
      return res.status(404).json({ error: "스타일을 찾을 수 없음" });
    }

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
