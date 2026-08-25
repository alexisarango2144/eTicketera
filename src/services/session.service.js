import usersRepository from "../repositories/users.repository.js";
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
      throw new Error(
        "Faltan campos obligatorios"
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegexString = process.env.EMAIL_REGEX;
    const emailRegex = new RegExp(emailRegexString || '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');

    if (!emailRegex.test(normalizedEmail)) {
      throw new Error("Email no válido");
    }

    const passwordMinLength = process.env.PASSWORD_MIN_LENGTH;

    if(password.length < passwordMinLength){
      throw new Error ("La constraseña no es válida");
    }

    const existingUser = await usersRepository.getByEmail(normalizedEmail);

    if(existingUser) {
      throw new Error("EMAIL_EXISTS");
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