import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github2";
import { AuthService } from "../services/auth.service.js";
import { UserRepository } from "../repositories/user.repository.js";

import { isValidPassword } from "../utils/hash.js";

const authService = new AuthService();
const userRepository = new UserRepository();

// REGISTRO DE USUARIO

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },

    async (req, email, password, done) => {
      try {
        const payload = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email,
          password,
        };

        const result = await authService.register(payload);

        return done(null, result);
      } catch (error) {
        if (error.code === "EMAIL_EXISTS") {
          return done(null, false, {
            message: "El email ya se encuentra registrado",
          });
        }

        return done(error);
      }
    },
  ),
);

// LOGIN DE USUARIO

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    async (email, password, done) => {
      try {
        const user = await authService.login(email, password);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// LOGIN CON GITHUB

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },

    async (accesToken, refreshToken, profile, done) => {
      try {
        console.log("Github profile: ", profile);

        let email = profile.emails?.[0]?.value;

        if (!email) {
          // Fallback para cuentas sin email público
          const gitEmail = await fetch(`https://api.github.com/user/emails`, {
            headers: {
              Authorization: `token ${accesToken}`,
              "User-Agent": "application/vnd.github+json",
            },
          });

          const emails = await gitEmail.json();

          email =
            emails.find((e) => e.primary && e.verified)?.email ??
            emails.find((e) => e.verified)?.email ??
            null;

          if (!email) {
            return done(null, false, {
              message:
                "GitHub no devolvió un email válido. Agrega un email público/verificado en tu perfil de GitHub o usa otro método de login.",
            });
          }
        }

        const first_name =
          profile.name?.givenName ||
          profile.displayName?.split(" ")?.[0] ||
          "Usuario";

        const last_name =
          profile.name?.familyName ||
          profile.displayName?.split(" ")?.slice(1).join(" ") ||
          "GitHub";

        const user = await authService.registerGitHubUser({
          first_name,
          last_name,
          email,
          providerId: profile.id,
        });

        return done(null, user);
      } catch (error) {
        console.error("Error de autenticación con GitHub", error);

        return done(error);
      }
    },
  ),
);

// COOKIE EXTRACTOR

const cookieExtractor = (req) => {
  if (req && req.cookies && req.cookies.currentUser) {
    return req.cookies.currentUser;
  } else {
    return null;
  }
};

// LOCAL STRATEGY

passport.use(
  "current",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),

      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const user = await userRepository.getById(jwt_payload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
