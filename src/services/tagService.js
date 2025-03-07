const Style = require('../models/Style');

const getPopularTags = async () => {
  const popularTags = await Style.aggregate([
    { $unwind: "$tags" }, 
    { $group: { _id: "$tags", count: { $sum: 1 } } }, 
    { $sort: { count: -1 } }, 
    { $limit: 10 }, 
  ]);

  return popularTags;
};

module.exports = { getPopularTags }; 