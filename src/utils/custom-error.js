export class CustomError extends Error {
  constructor (message, status = 500, options = {}) { 
    super(message);
    this.name = "CustomError";
    this.status = status;
    this.statusCode = status;
    this.code = options.code || "CUSTOM_ERROR";
    this.details = options.details || null;
    this.isOperational = true;

    if(options.cause) {
      this.cause = options.cause;
    }

  }
  
  static badRequest(message, details = null) {
    return new CustomError(message, 400, { code: "BAD_REQUEST", details });
  }

  static unauthorized(message = "No autenticado") {
    return new CustomError(message, 401, { code: "UNAUTHORIZED" });
  }

  static forbidden(message = "Sin permisos") {
    return new CustomError(message, 403, { code: "FORBIDDEN" });
  }

  static notFound(message = "No encontrado") {
    return new CustomError(message, 404, { code: "NOT_FOUND" });
  }

  static conflict(message, details) {
    return new CustomError(message, 409, { code: "CONFLICT", details });
  }

  static internal(message = "Error interno del servidor", details) {
    return new CustomError(message, 500, { code: "INTERNAL_ERROR", details });
  }
}