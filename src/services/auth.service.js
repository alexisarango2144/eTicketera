import { UserRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateJWT } from "../utils/jwt.js";
import { CustomError } from "../utils/custom-error.js";
import { AccountDTO } from "../dto/user.dto.js";
import "dotenv/config";

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data) {
    const { first_name, last_name, email, password } = data || {};

    if (!first_name || !last_name || !email || !password) {
      throw CustomError.badRequest("Faltan campos obligatorios");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegexString = process.env.EMAIL_REGEX;
    const emailRegex = emailRegexString
      ? new RegExp(emailRegexString)
      : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw new CustomError("Email no válido", 422, {
        code: "INVALID_EMAIL",
        details:
          "El correo electrónico proporcionado no tiene un formato válido",
        value: normalizedEmail,
      });
    }

    const passwordMinLength =
      parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 8;

    if (password.length < passwordMinLength) {
      throw new CustomError(
        `La constraseña debe tener al menos ${passwordMinLength} caracteres`,
        422,
        {
          code: "WEAK_PASSWORD",
          details: `La constraseña debe tener al menos ${passwordMinLength} caracteres`,
        },
      );
    }

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new CustomError(
        "El correo electrónico proporcionado ya se encuentra registrado",
        409,
        { code: "EMAIL_ALREADY_EXISTS" },
      );
    }

    const hashedPassword = await createHash(password);

    const user = await this.userRepository.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    return {
      user: new AccountDTO(user),
      token: generateJWT(user),
    };
  }

  async login(email, password) {
    if (!email || !password) {
      throw CustomError.badRequest("El email y contraseña son requeridos");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw CustomError.unauthorized(
        "Las credenciales proporcionadas no son válidas",
      );
    }

    if (user.provider !== "local") {
      return done(null, false, {
        message: `Este usuario no se registró mediante el proveedor local. Por favor, inicia sesión usando el proveedor original.`,
      });
    }

    const validPassword = await isValidPassword(password, user.password);

    if (!validPassword) {
      throw CustomError.unauthorized(
        "Las credenciales proporcionadas no son válidas",
      );
    }

    const accountDTO = new AccountDTO(user);

    return {
      user: accountDTO,
      token: generateJWT(user),
    };
  }

  // GitHub user registration

  async registerGitHubUser({ first_name, last_name, email, providerId }) {
    const normalizedEmail = email.trim().toLowerCase();

    let user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      user = await this.userRepository.create({
        first_name,
        last_name,
        email: normalizedEmail,
        password: null,
        role: "user",
        provider: "github",
        providerId,
      });
    }

    const accountDTO = new AccountDTO(user);
    return {
      user: accountDTO,
      token: generateJWT(user),
    };
  }
}
