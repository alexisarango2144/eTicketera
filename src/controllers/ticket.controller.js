import { TicketService } from "../services/ticket.service.js";
import { TicketDTO } from "../dto/tickets.dto.js";

const ticketService = new TicketService();

export const enroll = async (req, res, next) => {
    try {
        const {eventId} = req.params;
        const {quantity } = req.body;

        const ticket = await ticketService.enroll(req.user, eventId, quantity);

        res.status(201).json({
            status: "success",
            message: "Inscripción realizada con éxito",
            data: ticket
        });
    } catch (error) {
        next(error)
    }
}

export const cancelTicket = async(req, res, next)=>{
    try {
        const { ticketId } = req.params;
        const cancelledTicket = await ticketService.cancelTicket(req.user, ticketId);

        res.status(201).json({
            status: "success",
            message: `Ticket ${ticketId} cancelado correctamente`,
            data: cancelledTicket
        })
    } catch (error) {
        next(error)
    }
}

export const getTicketsByUser = async(req, res, next)=>{
    try {
        const result = await ticketService.getTicketsByUser(req.user, req.query);

        res.status(201).json({
            status: "success",
            message: "Tickets para el usuario obtenidos con éxito",
            ...result
        });
    } catch (error) {
        next(error);
    }
}

export const getTicketsByEvent = async(req, res, next)=>{
    try {
        const { eventId } = req.params;
        const result = await ticketService.getTicketsByEvent(eventId, req.query);
        const ticketDTOs = result.data.map(ticket => new TicketDTO(ticket));

        res.status(201).json({
            status: "success",
            message: "Tickets para el evento obtenidos con éxito",
            data: ticketDTOs
        });
    } catch (error) {
        next(error);
    }
}