const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500; // 기본값 500
  
  // 클라이언트 오류 (400, 403, 404)는 통일된 메시지 사용
  let errorMessage = "서버 에러가 발생했습니다.";
  if (statusCode >= 400 && statusCode < 500) {
    errorMessage = "잘못된 요청입니다";
  } else {
    // 서버 오류의 경우 원래 메시지 유지
    errorMessage = err.message || "서버 에러가 발생했습니다.";
  }
  
  res.status(statusCode).json({
    message: errorMessage,
  });
};

export default errorHandler;
