import { CustomError } from "../utils/custom-error.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw CustomError.unauthorized("Usuario no autenticado");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw CustomError.forbidden(
        "No tienes permisos para realizar esta acción",
      );
    }

    next();
  };
};
