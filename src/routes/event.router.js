import { Router } from "express";
import { create, getAll } from "../controllers/event.controller.js";

const router = Router();

router.get("/", getAll);
router.post("/create", create);

export default router;