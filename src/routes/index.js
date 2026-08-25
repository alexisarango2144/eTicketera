import { Router } from "express";
import healthRouter from "./health.router.js"
import eventsRouter from "./events.router.js"
import sessionsRouter from "./session.router.js"

const router = Router();

router.use("/health", healthRouter);
router.use("/sessions", sessionsRouter);

export default router;