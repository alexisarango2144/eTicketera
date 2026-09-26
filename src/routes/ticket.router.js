import {Router} from "express";

import { enroll, cancelTicket, getTicketsByEvent, getTicketsByUser } from "../controllers/ticket.controller.js"
import passport from "../config/passport.config.js";
import { authorizeRoles } from "../middlewares/authorization.mid.js";

const router = Router();

// Crear ticket / registrarse en un evento
router.post(
    "/event/:eventId/tickets", 
    passport.authenticate("current", {session: false}),
    enroll
);

// Obtener tickets para el usuario logueado
router.get(
    "/my-tickets", 
    passport.authenticate("current", {session: false}),
    getTicketsByUser
);

// Obtener tickets para un evento
router.get(
    "/event/:eventId/tickets", 
    passport.authenticate("current", {session: false}),
    authorizeRoles("organizer", "admin"),
    getTicketsByEvent
);

// Cancelar ticket / Cancelar inscripción a evento
router.patch(
    "/:ticketId/cancel",
    passport.authenticate("current", {session: false}),
    cancelTicket
);

export default router;