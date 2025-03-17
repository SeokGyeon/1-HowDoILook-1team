import prisma from "../config/database.js";
import bcrypt from "bcrypt";

// 답글 등록
export const createComment = async (req, res, next) => {
  try {
    const { content, password } = req.body;
    const { curationId } = req.params;

    // 필수 필드 검증
    if (!content || !password) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 큐레이션 찾기
    const curation = await prisma.curation.findUnique({
      where: { id: Number(curationId) },
      include: { 
        style: true,
        comments: true
      }
    });

    if (!curation) {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }

    // 이미 답글이 있는지 확인
    if (curation.comments && curation.comments.length > 0) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 스타일 정보 확인
    const style = curation.style;
    if (!style) {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }

    // 비밀번호 확인 - 직접 비교만 사용
    if (!style.password) {
      return res.status(500).json({ message: "서버 에러가 발생했습니다" });
    }
    
    if (style.password !== password) {
      return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    }

    // 답글 생성 - 스타일 작성자의 닉네임 사용
    const comment = await prisma.comment.create({
      data: {
        content,
        nickname: style.nickname, // 스타일 작성자의 닉네임 사용
        password, // 평문 그대로 저장
        curationId: Number(curationId),
      },
    });

    res.status(200).json({
      id: comment.id,
      nickname: comment.nickname,
      content: comment.content,
      createdAt: comment.createdAt,
    });
  } catch (error) {
    console.error("댓글 등록 오류:", error);
    next(error);
  }
};

// 답글 수정
export const updateComment = async (req, res, next) => {
  try {
    const { content, password } = req.body;
    const { commentId } = req.params;

    // 필수 필드 검증
    if (!content || !password) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 댓글 찾기
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }

    // 비밀번호 확인 - 평문과 암호화 모두 지원
    let isPasswordCorrect = false;
    
    // 1. 직접 비교 시도 (평문)
    if (comment.password === password) {
      isPasswordCorrect = true;
    } 
    // 2. bcrypt 비교 시도 (암호화된 경우)
    else if (comment.password && comment.password.startsWith('$2')) {
      isPasswordCorrect = await bcrypt.compare(password, comment.password);
    }
    
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    }

    // 답글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { content },
    });

    res.json({
      id: updatedComment.id,
      nickname: updatedComment.nickname,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// 답글 삭제
export const deleteComment = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { commentId } = req.params;

    // 필수 필드 검증
    if (!password) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 댓글 찾기
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }

    // 비밀번호 확인 - 평문과 암호화 모두 지원
    let isPasswordCorrect = false;
    
    // 1. 직접 비교 시도 (평문)
    if (comment.password === password) {
      isPasswordCorrect = true;
    } 
    // 2. bcrypt 비교 시도 (암호화된 경우)
    else if (comment.password && comment.password.startsWith('$2')) {
      isPasswordCorrect = await bcrypt.compare(password, comment.password);
    }
    
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    }

    // 댓글 삭제
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    res.json({
      message: "답글 삭제 성공",
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
      select: { 
        id: true, 
        nickname: true, 
        content: true, 
        createdAt: true 
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};
