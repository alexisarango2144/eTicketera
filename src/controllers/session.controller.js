import { UserDTO } from "../dto/user.dto.js";
import userModel from "../models/user.model.js";
import userService from "../services/user.service.js";
import { isValidPassword } from "../utils/hash.js";
import { generateJWT } from "../utils/jwt.js";

// Registro

export const register = async (req, res) => {
  return res.status(201).json({
    status: "success",
    message: "Usuario registrado correctamente"
  });
};

//Login local

export const login = async (req, res) => {
  try {
    const user = req.user;

    const token = generateJWT(user);

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
        message: "Autenticación exitosa"
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    })
  }
}

export const githubCallback = async (req, res) => {
  try {
    const token = generateJWT(req.user);

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
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error durante la autenticación con GitHub"
    })
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