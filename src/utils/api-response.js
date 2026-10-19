export const sendSuccess = (res, { statusCode = 200, message, data = null }) =>
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
