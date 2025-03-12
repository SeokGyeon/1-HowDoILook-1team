import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// 스타일 생성
export const createStyle = async (req, res, next) => {
  try {
    const {
      name,
      title,
      description,
      content = "",
      tags = [],
      nickname,
      password,
      categories = [],
    } = req.body;

    // 파일 업로드 처리
    const imageUrl =
      req.files && req.files.length > 0
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];
    const thumbnail = imageUrl.length > 0 ? imageUrl[0] : null;

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 태그 처리
    const tagIds = await Promise.all(
      tags.map(async (tagName) => {
        return prisma.tag.upsert({
          where: { name: tagName },
          update: { count: { increment: 1 } },
          create: { name: tagName, count: 1 },
        });
      })
    );

    // 스타일 생성
    const styleData = {
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
        connect: tagIds.map((tag) => ({ id: tag.id })),
      },
    };

    const style = await styleService.createStyle(styleData); // styleService의 createStyle 사용

    res.status(201).json(style);
  } catch (error) {
    // 에러 발생 시 업로드된 파일 삭제
    if (req.files) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }
    next(error);
  }
};

// 스타일 조회
export const getStyles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // 유효한 정렬 기준 확인
    const validSortFields = ["createdAt", "viewCount", "curationCount"];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "잘못된 정렬 기준입니다.",
      });
    }

    // 검색 조건 (제목, 닉네임, 설명에서 검색)
    const query = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { nickname: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // 전체 스타일 수 카운트
    const total = await prisma.style.count({
      where: query,
    });

    // 스타일 리스트 조회
    const styles = await prisma.style.findMany({
      where: query,
      orderBy: {
        [sortBy]: order === "desc" ? "desc" : "asc",
      },
      skip: (page - 1) * Number(limit),
      take: Number(limit),
      include: { tags: true },
    });

    // 응답 데이터 반환
    res.json({
      success: true,
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        styles,
      },
    });
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
};

// 스타일 업데이트
export const updateStyle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { passwd, tags, ...updateFields } = req.body;

    // 스타일 조회
    const style = await prisma.style.findUnique({
      where: { id: Number(id) },
      include: { tags: true },
    });

    if (!style) {
      return res
        .status(404)
        .json({ success: false, message: "스타일을 찾을 수 없습니다." });
    }

    // 비밀번호 검증
    if (passwd) {
      if (!(await bcrypt.compare(passwd, style.password))) {
        return res
          .status(401)
          .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }
    }

    // 이미지 파일 업데이트
    if (req.files && req.files.length > 0 && Array.isArray(style.imageUrl)) {
      // 기존 이미지 삭제
      style.imageUrl.forEach((url) => {
        const filePath = path.join(
          process.env.UPLOAD_DIR || "uploads",
          path.basename(url)
        );
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

      // 새 이미지 경로 업데이트
      updateFields.imageUrl = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
      updateFields.thumbnail = updateFields.imageUrl[0]; // 첫 번째 이미지를 썸네일로 설정
    }

    // 태그 업데이트
    if (tags) {
      // 기존 태그 카운트 감소
      await prisma.tag.updateMany({
        where: { id: { in: style.tags.map((tag) => tag.id) } },
        data: { count: { decrement: 1 } },
      });

      // 새 태그를 데이터베이스에 추가하거나 업데이트
      const tagIds = await Promise.all(
        tags.map(async (tagName) => {
          return prisma.tag.upsert({
            where: { name: tagName },
            update: { count: { increment: 1 } },
            create: { name: tagName, count: 1 },
          });
        })
      );

      // 새로운 태그 연결
      updateFields.tags = { connect: tagIds.map((tag) => ({ id: tag.id })) };
    }

    // 스타일 정보 수정
    const updatedStyle = await prisma.style.update({
      where: { id: Number(id) },
      data: updateFields,
    });

    res.json({ success: true, data: updatedStyle });
  } catch (error) {
    // 오류 발생 시 이미지 파일 삭제
    if (req.files) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }
    next(error);
  }
};

// 스타일 삭제
export const deleteStyle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { passwd } = req.body;

    // 스타일 조회
    const style = await prisma.style.findUnique({
      where: { id: parseInt(id) },
      include: { tags: true },
    });

    if (!style) {
      return res
        .status(404)
        .json({ success: false, message: "스타일을 찾을 수 없습니다." });
    }

    // 비밀번호 검증
    if (passwd) {
      const isPasswordValid = await bcrypt.compare(passwd, style.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
      }
    }

    // 이미지 삭제 (파일 경로가 존재할 경우)
    if (Array.isArray(style.imageUrl)) {
      style.imageUrl.forEach((url) => {
        const filePath = path.join(
          process.env.UPLOAD_DIR || "uploads",
          path.basename(url)
        );
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    // 태그 카운트 감소
    if (Array.isArray(style.tags)) {
      await prisma.tag.updateMany({
        where: { id: { in: style.tags.map((tag) => tag.id) } },
        data: { count: { decrement: 1 } },
      });
    }

    // 스타일 삭제
    await prisma.style.delete({ where: { id: Number(id) } });

    res
      .status(200)
      .json({ success: true, message: "스타일이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
};

// 랭킹 조회
export const getRanking = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query;

    let orderBy = {};
    if (type === "all") {
      orderBy = { curationCount: "desc" };
    } else if (
      ["trendy", "uniqueness", "practicality", "costEffectiveness"].includes(
        type
      )
    ) {
      orderBy = { [type]: "desc" };
    } else {
      return res.status(400).json({ message: "잘못된 랭킹 타입입니다." });
    }

    const total = await prisma.style.count();
    const styles = await prisma.style.findMany({
      orderBy,
      skip: (page - 1) * parseInt(limit, 10),
      take: parseInt(limit, 10),
      include: { tags: true },
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

// 스타일 랭킹 조회 (정렬 기준 추가)
export const getStyleRankings = async (req, res, next) => {
  try {
    const { sortBy = "curationCount", page = 1, limit = 10 } = req.query;

    // 유효한 정렬 필드 확인
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
      skip: (page - 1) * parseInt(limit),
      take: parseInt(limit),
      include: { tags: true },
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
