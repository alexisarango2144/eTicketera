import mongoose from "mongoose";

import { TicketRepository } from "../repositories/ticket.repository.js";
import { EventRepository } from "../repositories/event.repository.js";
import { generateTicketCode } from "../utils/ticketCode.js";
import { CustomError } from "../utils/custom-error.js";
import { EmailService } from "./email.service.js";
import { TicketDTO } from "../dto/tickets.dto.js";

const VALID_STATUSES = ["confirmed", "pending", "cancelled"];

export class TicketService {
    constructor() {
        this.ticketRepository = new TicketRepository();
        this.eventRepository = new EventRepository();
        this.emailService = new EmailService();
    }

    validateObjectId(id) {
        if (!mongoose.isValidObjectId(id)) {
            throw CustomError.badRequest("El ID de ticket proporcionado no es válido", 400);
        }
    }

    validateQuantity(quantity){
        const value = Number(quantity);
        if(!Number.isInteger(value) || value < 1){
            throw CustomError.badRequest("La cantidad de lugares debe ser mayor a 0");
        }
        return value
    }

    validateStatus(status) {
        if (status !== undefined && !VALID_STATUSES.includes(status)) {
          throw CustomError.badRequest(
            `El estado seleccionado no es válido. Los valores permitidos son: ${VALID_STATUSES.join(", ")}`,
          );
        }
      }

    async enroll(user, eventId, quantity){
        this.validateObjectId(eventId);
        const seats = this.validateQuantity(quantity);

        const event = await this.eventRepository.findById(eventId);
        if(!event){
            throw CustomError.notFound("No se encontró el evento");
        }

        if(event.status !== "published"){
            throw CustomError.badRequest("El evento no se encuentra disponible para inscribirse");
        }

        if(event.date < new Date()){
            throw CustomError.badRequest("El evento ya finalizó");
        }

        const existingTicket = await this.ticketRepository.findByUserAndEvent(user._id, event._id, "confirmed");

        if(existingTicket) throw CustomError.conflict("El usuario ya tiene un ticket confirmado para el evento");

        const reservedEvent = await this.eventRepository.reserveSeats(event._id, seats)
        if(!reservedEvent){
            throw CustomError.badRequest("El evento ya no tiene cupos disponibles");
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

        const ticketDTO = new TicketDTO(ticket);

        await this.emailService.sendTicketConfirmation(user, event, ticket);

        return  ticketDTO;
    }

    async getTicketsByUser(user, query) {
        const {
            status,
            page = 1,
            limit = 10,
            sort = "createdAt"
        } = query || {};

        this.validateStatus(status);

        const currentPage = Math.max(Number(page) || 1, 1);
        const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const allowedSortFields = ["createdAt", "status"];
        const sortField = sort.startsWith("-") ? sort.slice(1) : sort;

        if(!allowedSortFields.includes(sortField)){
            throw CustomError.badRequest(`El campo de ordenamiento no es válido. Los valores permitidos son: ${allowedSortFields.join(", ")}`);
        }

        const sortObject = {
            [sortField]: sort.startsWith("-") ? -1 : 1
        };

        const skip = (currentPage - 1) * currentLimit;

        const [data, total] = await Promise.all([
            this.ticketRepository.findByUser(user._id, filter, {
                skip,
                limit: currentLimit,
                sort: sortObject
            }),
            this.ticketRepository.count(user._id, filter)
        ]);

        const ticketDTOs = data.map((ticket) => new TicketDTO(ticket));

        return {
            items: ticketDTOs,
            total,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(total / currentLimit)
        }
    }

    async getTicketsByEvent(eventId, query){
        this.validateObjectId(eventId);

        const {
            page = 1,
            limit = 10,
            sort = "createdAt"
        } = query || {};

        const currentPage = Math.max(Number(page) || 1, 1);
        const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

        const allowedSortFields = ["createdAt", "status"];
        const sortField = sort.startsWith("-") ? sort.slice(1) : sort;

        if(!allowedSortFields.includes(sortField)){
            throw CustomError.badRequest(`El campo de ordenamiento no es válido. Los valores permitidos son: ${allowedSortFields.join(", ")}`);
        }

        const sortObject = {
            [sortField]: sort.startsWith("-") ? -1 : 1
        };

        const skip = (currentPage - 1) * currentLimit;

        const [data, total] = await Promise.all([
            this.ticketRepository.findByEvent(eventId, {
                skip,
                limit: currentLimit,
                sort: sortObject
            }),
            this.ticketRepository.countByEvent(eventId)
        ]);

        const ticketDTOs = data.map((ticket) => new TicketDTO(ticket));

        return {
            items: ticketDTOs,
            total,
            page: currentPage,
            limit: currentLimit,
            totalPages: Math.ceil(total / currentLimit)
        }
    }

    async cancelTicket(user, ticketId){
        this.validateObjectId(ticketId);

        const existingTicket = await this.ticketRepository.findById(ticketId);

        if(!existingTicket){
            throw CustomError.notFound("Ticket no encontrado");
        }

        const isAdmin = user.role === "admin";
        const ticketUserId = existingTicket.user._id.toString();
        const isOwner = ticketUserId === user._id.toString();

        if(!isAdmin && !isOwner){
            throw CustomError.forbidden("No tienes permisos para cancelar este ticket");
        }

        existingTicket.status = "cancelled";
        existingTicket.cancelledAt = new Date();
        const cancelled = await this.ticketRepository.save(existingTicket);

        const eventId = existingTicket.event?._id || existingTicket.event;

        await this.eventRepository.releaseSeats(eventId, existingTicket.quantity);
        
        await this.emailService.sendTicketCancellation(user, existingTicket.event, existingTicket);

        return new TicketDTO(cancelled);
    }
}