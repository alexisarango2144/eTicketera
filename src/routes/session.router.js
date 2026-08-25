import { Router } from "express";
import { register } from "../controllers/session.controller.js";

const router = Router();

router.post("/register", register);

export default router;