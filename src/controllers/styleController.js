import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

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
    const tagPromises = tags.map((tagName) =>
      prisma.tag.upsert({
        where: { name: tagName },
        update: { count: { increment: 1 } },
        create: { name: tagName, count: 1 },
      })
    );

    const tagResults = await Promise.all(tagPromises);
    const tagIds = tagResults.map((tag) => tag.id);

    const style = await prisma.style.create({
      data: {
        name,
        title,
        description,
        content,
        imageUrl,
        thumbnail,
        nickname,
        password: hashedPassword,
        categories,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });

    res.status(201).json(style);
  } catch (error) {
    console.error(error);
    // 에러 발생 시 업로드된 파일 삭제
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
    next(error);
  }
};

export const getStyles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const styles = await prisma.style.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { nickname: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          {
            tags: { some: { name: { contains: search, mode: "insensitive" } } },
          },
        ],
      },
      orderBy: { [sortBy]: order === "desc" ? "desc" : "asc" },
      skip: (page - 1) * limit,
      take: Number(limit),
    });

    const total = await prisma.style.count({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { nickname: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          {
            tags: { some: { name: { contains: search, mode: "insensitive" } } },
          },
        ],
      },
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
    console.error(error);
    next(error);
  }
};

export const getStyleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const style = await prisma.style.update({
      where: { id: Number(id) },
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
    console.error(error);
    next(error);
  }
};

export const updateStyle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { passwd, ...updateFields } = req.body;

    const style = await prisma.style.findUnique({
      where: { id: Number(id) },
    });

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
      await prisma.tag.updateMany({
        where: { id: { in: style.tags.map((tag) => tag.id) } },
        data: { count: { decrement: 1 } },
      });

      const tagPromises = updateFields.tags.map((tagName) =>
        prisma.tag.upsert({
          where: { name: tagName },
          update: { count: { increment: 1 } },
          create: { name: tagName, count: 1 },
        })
      );

      const tagResults = await Promise.all(tagPromises);
      updateFields.tags = tagResults.map((tag) => ({ id: tag.id }));
    }

    const updatedStyle = await prisma.style.update({
      where: { id: Number(id) },
      data: {
        ...updateFields,
        tags: {
          set: updateFields.tags.map((tag) => ({ id: tag.id })),
        },
      },
    });

    res.json({
      success: true,
      data: updatedStyle,
    });
  } catch (error) {
    console.error(error);
    // 에러 발생 시 업로드된 파일 삭제
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
    next(error);
  }
};

export const deleteStyle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { passwd } = req.body;

    const style = await prisma.style.findUnique({
      where: { id: Number(id) },
    });

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
      where: { id: { in: style.tags.map((tag) => tag.id) } },
      data: { count: { decrement: 1 } },
    });

    await prisma.style.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      success: true,
      message: "스타일이 삭제되었습니다.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getRanking = async (req, res, next) => {
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
    });

    const count = await prisma.style.count();

    res.json({
      styles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
