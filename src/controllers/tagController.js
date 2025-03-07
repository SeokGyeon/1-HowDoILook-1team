const tagService = require('../services/tagService');

exports.getPopularTags = async (req, res) => {
  try {
    const popularTags = await tagService.getPopularTags();
    res.json(popularTags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 