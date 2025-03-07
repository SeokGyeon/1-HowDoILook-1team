const Style = require('../models/Style');
const Tag = require('../models/Tag');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

exports.createStyle = async (req, res, next) => {
  try {
    const { name, title, description, content, tags, nickname, password, categories } = req.body;
    const imageUrl = req.files.map(file => `/uploads/${file.filename}`);
    const thumbnail = imageUrl[0];

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 태그 처리
    const tagIds = await Promise.all(tags.map(async (tagName) => {
      const tag = await Tag.findOneAndUpdate(
        { name: tagName },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );
      return tag._id;
    }));

    const style = new Style({
      name,
      title,
      description,
      content,
      imageUrl,
      thumbnail,
      tags: tagIds,
      nickname,
      password: hashedPassword,
      categories
    });

    await style.save();
    res.status(201).json(style);
  } catch (error) {
    // 에러 발생 시 업로드된 파일 삭제
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    next(error);
  }
};

exports.getStyles = async (req, res, next) => {
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

    res.json({
      success: true,
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        styles
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getStyleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const style = await Style.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!style) {
      const error = new Error("스타일을 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    res.json({
      success: true,
      data: style
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStyle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { passwd, ...updateFields } = req.body;

    const style = await Style.findById(id);

    if (!style) {
      const error = new Error("스타일을 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    if (style.password !== passwd) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.status = 401;
      return next(error);
    }

    // 새로운 이미지가 업로드된 경우
    if (req.files && req.files.length > 0) {
      // 기존 이미지 파일 삭제
      style.imageUrl.forEach(url => {
        const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', path.basename(url));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // 새 이미지 URL 설정
      updateFields.imageUrl = req.files.map(file => `/uploads/${file.filename}`);
      updateFields.thumbnail = updateFields.imageUrl[0];
    }

    // 태그 업데이트
    if (updateFields.tags) {
      // 기존 태그의 count 감소
      await Tag.updateMany(
        { _id: { $in: style.tags } },
        { $inc: { count: -1 } }
      );

      // 새 태그 처리
      const tagIds = await Promise.all(updateFields.tags.map(async (tagName) => {
        const tag = await Tag.findOneAndUpdate(
          { name: tagName },
          { $inc: { count: 1 } },
          { upsert: true, new: true }
        );
        return tag._id;
      }));
      updateFields.tags = tagIds;
    }

    Object.assign(style, updateFields);
    await style.save();
    res.json({
      success: true,
      data: style
    });
  } catch (error) {
    // 에러 발생 시 업로드된 파일 삭제
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    next(error);
  }
};

exports.deleteStyle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { passwd } = req.body;

    const style = await Style.findById(id);

    if (!style) {
      const error = new Error("스타일을 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    if (style.password !== passwd) {
      const error = new Error("비밀번호가 일치하지 않습니다.");
      error.status = 401;
      return next(error);
    }

    // 이미지 파일 삭제
    style.imageUrl.forEach(url => {
      const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', path.basename(url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // 태그 count 감소
    await Tag.updateMany(
      { _id: { $in: style.tags } },
      { $inc: { count: -1 } }
    );

    await style.remove();
    res.status(200).json({
      success: true,
      message: "스타일이 삭제되었습니다."
    });
  } catch (error) {
    next(error);
  }
};

exports.getRanking = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query;

    let sortOption = {};
    switch (type) {
      case 'all':
        sortOption = { curationCount: -1 };
        break;
      case 'trendy':
      case 'uniqueness':
      case 'practicality':
      case 'costEffectiveness':
        sortOption = { [`averageScores.${type}`]: -1 };
        break;
      default:
        return res.status(400).json({ message: '잘못된 랭킹 타입입니다.' });
    }

    const styles = await Style.find()
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('tags');

    const count = await Style.countDocuments();

    res.json({
      styles,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStyleRankings = async (req, res, next) => {
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
      const error = new Error("잘못된 정렬 기준입니다.");
      error.status = 400;
      return next(error);
    }

    const total = await Style.countDocuments();
    const styles = await Style.find()
      .sort({ [sortBy]: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        styles
      }
    });
  } catch (error) {
    next(error);
  }
}; 