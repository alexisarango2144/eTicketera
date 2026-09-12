import { Router } from "express";
import {
  current,
  login,
  logout,
  register,
  githubCallback,
} from "../controllers/session.controller.js";
import passport from "../config/passport.config.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  register,
);

router.post(
    "/login",
    passport.authenticate("login", { session: false }), 
    login
);

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
    "/github/callback",
    passport.authenticate("github", { session: false }),
    githubCallback
)

router.get(
    "/current", 
    passport.authenticate("current", { session: false }), current
);

router.post(
    "/logout", 
    logout
);

export default router;
