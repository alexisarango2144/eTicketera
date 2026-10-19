import { generateJWT } from "../utils/jwt.js";
import { UserDTO } from "../dto/user.dto.js";
import { sendSuccess } from "../utils/api-response.js";


// Registro

export const register = async (req, res, next) => {
  try {
    const {user, token} = req.user;
    
    return sendSuccess(res, {
      statusCode: 201,
      message: "Usuario registrado correctamente",
      data: {user, token}
    });
  } catch (error) {
    return next(error);
  }
};

//Login local

export const login = async (req, res, next) => {
  try {
    const user = req.user;

    res.cookie('currentUser', req.user?.token, {
      httpOnly: true,
      maxAge: 3600000, // 60 * 60 * 1000
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    })

    return sendSuccess(res, {
      statusCode: 200,
      message: "Usuario autenticado",
      data: { ...user, token: req.user?.token }
    });
  } catch (error) {
    next(error);
  }
}

export const githubCallback = async (req, res, next) => {
  try {
    const token = generateJWT(req.user?.user || req.user);

    res.cookie('currentUser', token, {
      httpOnly: true,
      maxAge: 3600000, // 60 * 60 * 1000
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    })

    return sendSuccess(res, {
      statusCode: 200,
      message: "Autenticación vía GitHub exitosa",
      data: { token }
    });
  } catch (error) {
    next(error);
  }
}

// Current

export const current = async (req, res, next) => {
  try {
    const user = req.user;

    const userDTO = new UserDTO(user);

    return sendSuccess(res, {
      statusCode: 200,
      message: "Sesión activa para el usuario",
      data: userDTO
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async(req, res) => {
  res.clearCookie("currentUser");

  return sendSuccess(res, {
    statusCode: 200,
    message: "Logout exitoso"
  });
};