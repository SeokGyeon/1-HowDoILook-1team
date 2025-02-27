import Style from "../models/style.js";

// 스타일 등록
export const createStyle = async (req, res) => {
  try {
    const style = new Style(req.body);
    await style.save();
    res.status(201).json(style);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 스타일 목록 조회
export const getStyles = async (req, res) => {
  try {
    const styles = await Style.find();
    res.json(styles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 스타일 수정
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

// 스타일 삭제
export const deleteStyle = async (req, res) => {
  try {
    const { id } = req.params;
    await Style.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
