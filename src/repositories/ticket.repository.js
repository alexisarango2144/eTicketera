import { TicketDAO } from "../dao/ticket.dao";

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
        return this.dao.findById(id);
    }

    findByUser(userId){
        return this.dao.findByUser(userId);
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
}