import { UserDTO } from "../dto/user.dto.js";
import userModel from "../models/user.model.js";
import sessionService from "../services/session.service.js";
import { isValidPassword } from "../utils/hash.js";
import { generateJWT } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const result = await sessionService.register(req.body);

    return res.status(201).json({
      status: "success",
      payload: result,
    });
  } catch (error) {
    if (error.message == "EMAIL_EXISTS") {
      return res.status(409).json({
        status: "error",
        message: "El email ya se encuentra registrado",
      });
    }

    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if(!email || !password){
      return res.status(400).json({
        status: "error",
        message: "El email y la contraseña son obligatorios"
      })
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await userModel.findOne({email: normalizedEmail});

    if(!user) {
      return res.status(401).json({
        status: "error",
        message: "Credenciales inválidas"
      })
    }
    
    const validPassword = await isValidPassword(password, user.password);
    
    if(!validPassword){
      return res.status(401).json({
        status: "error",
        message: "Credenciales inválidas"
      })
    }

    const userToken = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const token = generateJWT(userToken);

    res.cookie('currentUser', token, {
      httpOnly: true,
      maxAge: 3600000, // 60 * 60 * 1000
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    })

    res.status(200).json({
      status: "success",
      message: "Autenticación exitosa"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    })
  }
}

export const current = async (req, res) => {
  try {
    const user = req.user;

    const userDTO = new UserDTO(user);

    return res.status(200).json({
      status: "success",
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