import { Router } from "express";
import healthRouter from "./health.router.js"
import eventsRouter from "./events.router.js"

const router = Router();

router.use("/health", healthRouter);
router.use("/events", eventsRouter);

export default router;