import { AuthService } from "../services/auth.service.js";
import { generateJWT } from "../utils/jwt.js";
import { UserDTO } from "../dto/user.dto.js";

const authService = new AuthService();

// Registro

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    res.status(201).json({
      status: "success",
      message: "Usuario registrado",
      data: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    next(error);
  }
};

//Login local

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "El email y contraseña son requeridos"
      });
    }

    const result = await authService.login(email, password);

    const user = req.user;
    const token = generateJWT(user);

    res.cookie('currentUser', token, {
      httpOnly: true,
      maxAge: 3600000, // 60 * 60 * 1000
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    })

    res.json({
      status: "success",
      message: "Usuario autenticado",
      data: {...result}
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

    return res
      .status(200)
      .json({
        status: "success",
        message: "Autenticación vía GitHub exitosa"
      });
  } catch (error) {
    next(error);
  }
}

// Current

export const current = async (req, res) => {
  try {
    const user = req.user;

    const userDTO = new UserDTO(user);

    return res.status(200).json({
      status: "success",
      message: "Sesión activa para el usuario",
      payload: userDTO
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
};

export const logout = async(req, res) => {
  res.clearCookie("currentUser");

  return res.status(200).json({
    status: "success",
    message: "Logout exitoso"
  });
};