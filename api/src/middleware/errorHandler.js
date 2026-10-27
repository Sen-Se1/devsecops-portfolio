function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;

  if (res.headersSent) {
    return next(err);
  }

  if (statusCode >= 500) {
    console.error("Internal Server Error:", err);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      message:
        statusCode >= 500
          ? "Internal server error"
          : err.message || "An error occurred",
      ...(err.details && { details: err.details }),
    },
  });
}

module.exports = errorHandler;