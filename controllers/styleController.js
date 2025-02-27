import Style from "../models/style.js";

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
    await Style.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
