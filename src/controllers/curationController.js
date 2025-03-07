const Curation = require('../models/Curation');
const Style = require('../models/Style');
const bcrypt = require('bcrypt');

exports.createCuration = async (req, res, next) => {
  try {
    const { nickname, password, content, scores } = req.body;
    const styleId = req.params.styleId;

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    const curation = new Curation({
      styleId,
      nickname,
      password: hashedPassword,
      content,
      scores
    });

    await curation.save();

    // 스타일의 큐레이션 카운트 증가
    await Style.findByIdAndUpdate(styleId, { $inc: { curationCount: 1 } });

    res.status(201).json({
      success: true,
      data: curation,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCurations = async (req, res, next) => {
  const { styleId, page = 1, pageSize = 10, searchBy, keyword } = req.query;
  const query = {};

  if (styleId) query.styleId = styleId;
  if (searchBy && keyword) {
    query[searchBy] = { $regex: keyword, $options: "i" };
  }

  try {
    const skip = (page - 1) * pageSize;
    const curations = await Curation.find(query)
      .skip(skip)
      .limit(Number(pageSize));
    const totalCurations = await Curation.countDocuments(query);

    res.status(200).json({
      success: true,
      data: curations,
      pagination: {
        currentPage: page,
        pageSize: Number(pageSize),
        totalItems: totalCurations,
        totalPages: Math.ceil(totalCurations / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCuration = async (req, res, next) => {
  const { id } = req.params;
  const { passwd, ...updateFields } = req.body;

  try {
    const curation = await Curation.findById(id);

    if (!curation) {
      const error = new Error("큐레이션을 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    if (curation.password !== passwd) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.status = 401;
      return next(error);
    }

    Object.assign(curation, updateFields);
    await curation.save();

    res.status(200).json({
      success: true,
      data: curation,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCuration = async (req, res, next) => {
  const { id } = req.params;
  const { passwd } = req.body;

  try {
    const curation = await Curation.findById(id);

    if (!curation) {
      const error = new Error("큐레이션을 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    if (curation.password !== passwd) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.status = 401;
      return next(error);
    }

    // 스타일의 큐레이션 카운트 감소
    await Style.findByIdAndUpdate(curation.styleId, { $inc: { curationCount: -1 } });

    await curation.remove();
    res
      .status(200)
      .json({ success: true, message: "큐레이션이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
}; 