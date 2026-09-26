import { TicketService } from "../services/ticket.service.js";
import { UserDTO } from "../dto/user.dto.js";
import { EventDTO } from "../dto/event.dto.js";
import { TicketDTO } from "../dto/tickets.dto.js";

const ticketService = new TicketService();

export const enroll = async (req, res, next) => {
    try {
        const {eventId} = req.params;
        const {quantity } = req.body;

        const ticket = await ticketService.enroll(req.user, eventId, quantity);

        const ticketDTO = new TicketDTO(ticket);

        res.status(201).json({
            status: "success",
            message: "Inscripción realizada con éxito",
            data: ticketDTO
        });
    } catch (error) {
        next(error)
    }
}

export const cancelTicket = async(req, res, next)=>{
    try {
        const { ticketId } = req.params;
        const cancelled = await ticketService.cancelTicket(req.user, ticketId);
        const ticketDTO = new TicketDTO(cancelled);

        res.status(201).json({
            status: "success",
            message: `Ticket ${ticketId} cancelado correctamente`,
            data: ticketDTO
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
        const tickets = await ticketService.getTicketsByEvent(eventId);
        const ticketDTOs = tickets.map(ticket => new TicketDTO(ticket));

        res.status(201).json({
            status: "success",
            message: "Tickets para el evento obtenidos con éxito",
            data: ticketDTOs
        });
    } catch (error) {
        next(error);
    }
}