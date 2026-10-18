
function errorHandler(err, req, res, next) {
  console.error("API Error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message:
      err.status || err.statusCode
        ? err.message
        : "An unexpected server error occurred.",
  });
}

module.exports = errorHandler;


