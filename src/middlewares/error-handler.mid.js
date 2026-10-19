export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.statusCode || error.status || 500;

  res.status(status).json({
    status: "error",
    code: error.code || "INTERNAL_ERROR",
    message: error.message || "Error interno del servidor",
    ...(error.details && { details: error.details }),
  });
};