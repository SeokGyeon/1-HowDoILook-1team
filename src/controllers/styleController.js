import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

// 스타일 생성
export const createStyle = async (req, res, next) => {
  try {
    const {
      name,
      title,
      description,
      content,
      tags,
      nickname,
      password,
      categories,
    } = req.body;

    const imageUrl = req.files.map((file) => `/uploads/${file.filename}`);
    const thumbnail = imageUrl[0];

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 태그 처리
    const tagIds = await Promise.all(
      tags.map(async (tagName) => {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: { count: { increment: 1 } },
          create: { name: tagName, count: 1 },
        });
        return tag.id;
      })
    );

    const style = await prisma.style.create({
      data: {
        name,
        title,
        description,
        content,
        imageUrl,
        thumbnail,
        tags: { connect: tagIds.map((id) => ({ id })) },
        nickname,
        password: hashedPassword,
        categories,
      },
    });

    res.status(201).json(style);
  } catch (error) {
    // 에러 발생 시 업로드된 파일 삭제
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
    next(error);
  }
};

// 스타일 목록 조회
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
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { nickname: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            {
              tags: {
                some: { name: { contains: search, mode: "insensitive" } },
              },
            },
          ],
        }
      : {};

    const styles = await prisma.style.findMany({
      where: query,
      take: Number(limit),
      skip: (page - 1) * limit,
      orderBy: { [sortBy]: order === "desc" ? "desc" : "asc" },
      include: { tags: true },
    });

    const totalStyles = await prisma.style.count({ where: query });

    res.json({
      success: true,
      data: {
        total: totalStyles,
        page: Number(page),
        limit: Number(limit),
        styles,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 스타일 조회
export const getStyleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const style = await prisma.style.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    if (!style) {
      const error = new Error("스타일을 찾을 수 없습니다.");
      error.status = 404;
      return next(error);
    }

    res.json({
      success: true,
      data: style,
    });
  } catch (error) {
    next(error);
  }
};

// 스타일 수정
export const updateStyle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { passwd, ...updateFields } = req.body;

    const style = await prisma.style.findUnique({ where: { id } });

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
      style.imageUrl.forEach((url) => {
        const filePath = path.join(
          process.env.UPLOAD_DIR || "uploads",
          path.basename(url)
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // 새 이미지 URL 설정
      updateFields.imageUrl = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
      updateFields.thumbnail = updateFields.imageUrl[0];
    }

    // 태그 업데이트
    if (updateFields.tags) {
      // 기존 태그의 count 감소
      await prisma.tag.updateMany({
        where: { id: { in: style.tags } },
        data: { count: { decrement: 1 } },
      });

      // 새 태그 처리
      const tagIds = await Promise.all(
        updateFields.tags.map(async (tagName) => {
          const tag = await prisma.tag.upsert({
            where: { name: tagName },
            update: { count: { increment: 1 } },
            create: { name: tagName, count: 1 },
          });
          return tag.id;
        })
      );
      updateFields.tags = tagIds;
    }

    const updatedStyle = await prisma.style.update({
      where: { id },
      data: { ...updateFields },
    });

    res.json({
      success: true,
      data: updatedStyle,
    });
  } catch (error) {
    // 에러 발생 시 업로드된 파일 삭제
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
    next(error);
  }
};

// 스타일 삭제
export const deleteStyle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { passwd } = req.body;

    const style = await prisma.style.findUnique({ where: { id } });

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
    style.imageUrl.forEach((url) => {
      const filePath = path.join(
        process.env.UPLOAD_DIR || "uploads",
        path.basename(url)
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // 태그 count 감소
    await prisma.tag.updateMany({
      where: { id: { in: style.tags } },
      data: { count: { decrement: 1 } },
    });

    await prisma.style.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "스타일이 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

// 스타일 랭킹 조회
export const getRanking = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query;

    let sortOption = {};
    switch (type) {
      case "all":
        sortOption = { curationCount: "desc" };
        break;
      case "trendy":
      case "uniqueness":
      case "practicality":
      case "costEffectiveness":
        sortOption = { [`averageScores.${type}`]: "desc" };
        break;
      default:
        return res.status(400).json({ message: "잘못된 랭킹 타입입니다." });
    }

    const styles = await prisma.style.findMany({
      orderBy: sortOption,
      take: limit,
      skip: (page - 1) * limit,
      include: { tags: true },
    });

    const count = await prisma.style.count();

    res.json({
      styles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 스타일 랭킹 조회 (정렬)
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
      const error = new Error("잘못된 정렬 기준입니다.");
      error.status = 400;
      return next(error);
    }

    const total = await prisma.style.count();
    const styles = await prisma.style.findMany({
      orderBy: { [sortBy]: "desc" },
      skip: (page - 1) * limit,
      take: Number(limit),
    });

    res.json({
      success: true,
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        styles,
      },
    });
  } catch (error) {
    next(error);
  }
};
