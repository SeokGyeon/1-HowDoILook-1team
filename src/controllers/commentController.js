import prisma from "../config/database.js";
import bcrypt from "bcrypt";

// 답글 등록
export const createComment = async (req, res, next) => {
  try {
    const { content, nickname, passwd } = req.body;
    const { curationId } = req.params;

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(passwd, 10);

    // 답글 생성
    const comment = await prisma.comment.create({
      data: {
        content,
        nickname,
        passwd: hashedPassword,
        curationId: Number(curationId),
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: comment.id,
        content: comment.content,
        nickname: comment.nickname,
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      // duplicate key error
      const err = new Error("이미 답글이 존재합니다");
      err.status = 400;
      return next(err);
    }
    next(error);
  }
};

// 답글 수정
export const updateComment = async (req, res, next) => {
  try {
    const { content, passwd } = req.body;
    const { commentId } = req.params;

    // 댓글 찾기
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      const error = new Error("답글을 찾을 수 없습니다");
      error.status = 404;
      return next(error);
    }

    // 비밀번호 확인
    const isPasswordCorrect = await bcrypt.compare(passwd, comment.passwd);
    if (!isPasswordCorrect) {
      const error = new Error("비밀번호가 일치하지 않습니다");
      error.status = 401;
      return next(error);
    }

    // 답글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { content },
    });

    res.json({
      success: true,
      data: {
        id: updatedComment.id,
        content: updatedComment.content,
        nickname: updatedComment.nickname,
        createdAt: updatedComment.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 답글 삭제
export const deleteComment = async (req, res, next) => {
  try {
    const { passwd } = req.body;
    const { commentId } = req.params;

    // 댓글 찾기
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      const error = new Error("답글을 찾을 수 없습니다");
      error.status = 404;
      return next(error);
    }

    // 비밀번호 확인
    const isPasswordCorrect = await bcrypt.compare(passwd, comment.passwd);
    if (!isPasswordCorrect) {
      const error = new Error("비밀번호가 일치하지 않습니다");
      error.status = 401;
      return next(error);
    }

    // 댓글 삭제
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    res.json({
      success: true,
      message: "답글이 삭제되었습니다",
    });
  } catch (error) {
    next(error);
  }
};

// 답글 목록 조회
export const getComments = async (req, res, next) => {
  try {
    const { curationId } = req.params;

    // 답글 목록 조회
    const comments = await prisma.comment.findMany({
      where: { curationId: Number(curationId) },
      select: { content: true, nickname: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};
