import { Router } from "express";
import healthRouter from "./health.router.js"
import sessionsRouter from "./session.router.js"
import eventsRouter from "./event.router.js"
import ticketsRouter from "./ticket.router.js"

const router = Router();

router.use("/health", healthRouter);
router.use("/sessions", sessionsRouter);
router.use("/events", eventsRouter);
router.use("/tickets", ticketsRouter);

export default router;