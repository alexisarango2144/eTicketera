import { Router } from "express";
import { create, getAll } from "../controllers/event.controller.js";
import passport from "../config/passport.config.js";

const router = Router();

router.get("/", passport.authenticate("current", {session: false}), getAll);
router.post("/create", create);

export default router;