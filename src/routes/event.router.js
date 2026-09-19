import { Router } from "express";
import { createEvent, getEvents, getEventById, updateEvent, changeEventStatus } from "../controllers/event.controller.js";
import passport from "../config/passport.config.js";
import { authorizeRoles } from "../middlewares/authorization.mid.js";

const router = Router();

// Rutas públicas
router.get("/", getEvents);
router.get("/:eventId", getEventById);

// Rutas para organizer o admin
router.post(
    "/", 
    passport.authenticate("current", {session: false}),
    authorizeRoles("organizer", "admin"), 
    createEvent
);

// Owner o admin pueden actualizar el evento
router.put(
    "/:eventId", 
    passport.authenticate("current", {session: false}), 
    authorizeRoles("organizer", "admin"), 
    updateEvent
);

router.patch(
    "/:eventId/status",
    passport.authenticate("current", {session: false}),
    authorizeRoles("organizer", "admin"),
    changeEventStatus
);

export default router;