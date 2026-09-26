import { TicketService } from "../services/ticket.service.js";

const ticketService = new TicketService();

export const enroll = async (req, res, next) => {
    try {
        const {eventId} = req.params;
        const {quantity } = req.body;

        const ticket = await ticketService.enroll(req.user, eventId, quantity);

        res.status(201).json({
            status: "success",
            message: "Inscripción realizada con éxito",
            data: {
                id: ticket._id,
                event: ticket.event,
                quantity: ticket.quantity,
                status: ticket.status,
                reservationCode: ticket.reservationCode
            }
        });
    } catch (error) {
        next(error)
    }
}

export const cancelTicket = async(req, res, next)=>{
    try {
        const { ticketId } = req.params;
        const cancelled = await ticketService.cancelTicket(req.user, ticketId);
        
        res.status(201).json({
            status: "success",
            message: `Ticket ${ticketId} cancelado correctamente`,
            data: cancelled
        })
    } catch (error) {
        next(error)
    }
}

export const getTicketsByUser = async(req, res, next)=>{
    try {
        const tickets = await ticketService.getTicketsByUser(req.user)
        res.status(201).json({
            status: "success",
            message: "Tickets para el usuario obtenidos con éxito",
            data: tickets
        });
    } catch (error) {
        next(error);
    }
}

export const getTicketsByEvent = async(req, res, next)=>{
    try {
        const { eventId } = req.params;
        const tickets = await ticketService.getTicketsByEvent(eventId);
        res.status(201).json({
            status: "success",
            message: "Tickets para el evento obtenidos con éxito",
            data: tickets
        });
    } catch (error) {
        next(error);
    }
}