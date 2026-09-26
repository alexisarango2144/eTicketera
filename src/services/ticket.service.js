import mongoose from "mongoose";

import { TicketRepository } from "../repositories/ticket.repository.js";
import { EventRepository } from "../repositories/event.repository.js";
import { generateTicketCode } from "../utils/ticketCode.js";
import { CustomError } from "../utils/custom-error.js";
import { EmailService } from "./email.service.js";

export class TicketService {
    constructor() {
        this.ticketRepository = new TicketRepository();
        this.eventRepository = new EventRepository();
        this.emailService = new EmailService();
    }

    validateObjectId(id) {
        if (!mongoose.isValidObjectId(id)) {
            throw new CustomError("El ID de ticket proporcionado no es válido", 400);
        }
    }

    validateQuantity(quantity){
        const value = Number(quantity);
        if(!Number.isInteger(value) || value < 1){
            throw new CustomError("La cantidad de lugares debe ser mayor a 0");
        }
        return value
    }

    async enroll(user, eventId, quantity){
        this.validateObjectId(eventId);
        const seats = this.validateQuantity(quantity);

        const event = await this.eventRepository.findById(eventId);
        if(!event){
            throw new CustomError("No se encontró el evento", 404);
        }

        if(event.status !== "published"){
            throw new CustomError("El evento no se encuentra disponible para inscribirse", 400);
        }

        if(event.date < new Date()){
            throw new CustomError("El evento ya finalizó", 400);
        }

        const existingTicket = await this.ticketRepository.findByUserAndEvent(user._id, event._id, "confirmed");

        if(existingTicket) throw new CustomError("El usuario ya se encuentra anotado en el evento", 409);

        const reservedEvent = await this.eventRepository.reserveSeats(event._id, seats)
        if(!reservedEvent){
            throw new CustomError("El evento ya no tiene cupos disponibles");
        }

        let ticket = null;
        try {
            ticket = await this.ticketRepository.create({
                user: user._id,
                event: event._id,
                quantity: seats,
                status: "confirmed",
                reservationCode: generateTicketCode()
            })
        } catch (error) {
            await this.eventRepository.releaseSeats(event._id, seats);
            throw error;
        }

        await this.emailService.sendTicketConfirmation(user, event, ticket);

        return ticket;
    }

    async getTicketsByUser(user) {
        return this.ticketRepository.findByUser(user._id);
    }

    async getTicketsByEvent(eventId){
        this.validateObjectId(eventId);
        
        return this.ticketRepository.findByEvent(eventId);
    }

    async cancelTicket(user, ticketId){
        this.validateObjectId(ticketId);

        const existingTicket = await this.ticketRepository.findById(ticketId);

        if(!existingTicket){
            throw new CustomError("Ticket no encontrado", 404);
        }

        const isAdmin = user.role === "admin";
        const ticketUserId = existingTicket.user._id.toString();
        const isOwner = ticketUserId === user._id.toString();

        if(!isAdmin && !isOwner){
            throw new CustomError("No tienes permisos para cancelar este ticket", 403);
        }

        existingTicket.status = "cancelled";
        existingTicket.cancelledAt = new Date();
        const cancelled = await this.ticketRepository.save(existingTicket);

        const eventId = existingTicket.event?._id || existingTicket.event;

        await this.eventRepository.releaseSeats(eventId, existingTicket.quantity);
        
        await this.emailService.sendTicketCancellation(user, existingTicket.event, existingTicket);

        return cancelled;
    }
}