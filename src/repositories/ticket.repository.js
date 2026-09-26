import { TicketDAO } from "../dao/ticket.dao.js";

export class TicketRepository{
    constructor(){
        this.dao = new TicketDAO();
    }

    create(data){
        return this.dao.create(data);
    }

    findByUserAndEvent(userId, eventId, status){
        return this.dao.findByUserAndEvent(userId, eventId, status);
    }

    findById(id){
        return this.dao.getById(id);
    }

    findByUser(userId, filter, pagination){
        return this.dao.findByUser(userId, filter, pagination);
    }

    findByEvent(eventId){
        return this.dao.findByEvent(eventId);
    }

    save(ticket){
        return ticket.save(ticket);
    }

    sumReservedByEvent(eventId){
        return this.dao.sumReservedByEvent(eventId);
    }

    count(userId, filter){
        return this.dao.count(userId, filter);
    }
}