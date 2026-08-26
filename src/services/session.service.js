import usersRepository from "../repositories/users.repository.js";
import { CustomError } from "../utils/custom-error.js";
import { createHash } from "../utils/hash.js";
import "dotenv/config";

class SessionService {
  async register(data) {
    const {
      first_name,
      last_name,
      email,
      password
    } = data || {};

    if (!first_name || !last_name || !email || !password) {
      throw new CustomError("Faltan campos obligatorios", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegexString = process.env.EMAIL_REGEX;
    const emailRegex = emailRegexString 
      ? new RegExp(emailRegexString) 
      : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw new CustomError("Email no válido", 422);
    }

    const passwordMinLength = parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 8;

    if(password.length < passwordMinLength){
      throw new CustomError (`La constraseña debe tener al menos ${passwordMinLength} caracteres`, 422);
    }

    const existingUser = await usersRepository.getByEmail(normalizedEmail);

    if(existingUser) {
      throw new CustomError("EMAIL_EXISTS", 409);
    }

    const hashedPassword = await createHash(password);

    const user = await usersRepository
      .create({
        first_name,
        last_name,
        email: normalizedEmail,
        password: hashedPassword
      });

    return {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    };

  }
}

export default new SessionService();