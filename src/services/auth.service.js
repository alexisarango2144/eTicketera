import { UserRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateJWT } from "../utils/jwt.js";
import { CustomError } from "../utils/custom-error.js";
import "dotenv/config";

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data) {
    const { first_name, last_name, email, password } = data || {};

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

    const passwordMinLength =
      parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 8;

    if (password.length < passwordMinLength) {
      throw new CustomError(
        `La constraseña debe tener al menos ${passwordMinLength} caracteres`,
        422,
      );
    }

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new CustomError(
        "El correo electrónico proporcionado ya se encuentra registrado",
        409,
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
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token: generateJWT(user),
    };
  }

  async login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new CustomError(
        "Las credenciales proporcionadas no son válidas",
        401,
      );
    }

    const validPassword = await isValidPassword(password, user.password);

    if (!validPassword) {
      throw new CustomError(
        "Las credenciales proporcionadas no son válidas",
        401,
      );
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
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

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token: generateJWT(user),
    };
  }
}
