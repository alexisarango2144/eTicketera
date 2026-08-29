import { Router } from "express";
import { current, login, logout, register } from "../controllers/session.controller.js";
import { authMiddleware } from "../middlewares/auth.mid.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current", authMiddleware, current);
router.post("/logout", logout);

export default router;