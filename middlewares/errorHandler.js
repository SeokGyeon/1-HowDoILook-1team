const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
  res.status(statusCode).json({ error: err.message });
};

export default errorHandler;
