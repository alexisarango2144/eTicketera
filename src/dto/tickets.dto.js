export class TicketDTO {
    constructor(ticket){
        this.id = ticket.id;
        this.reservationCode = ticket.reservationCode;
        this.user = ticket.user;
        this.event = ticket.event;
        this.status = ticket.status;
        this.quantity = ticket.quantity;
        this.createdAt = ticket.createdAt;
    }
}