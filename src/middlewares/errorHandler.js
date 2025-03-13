const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500; // 기본값 500
  res.status(statusCode).json({
    success: false,
    message: err.message || "서버 에러가 발생했습니다.",
  });
};

export default errorHandler;
