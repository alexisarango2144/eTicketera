import { EventDTO } from "./event.dto.js";
import { UserDTO } from "./user.dto.js";
import { referenceId } from "./reference.dto.js";

export class TicketDTO {
    constructor(ticket){
        const user = ticket.user;
        const userIsPopulated =
            user &&
            typeof user === "object" &&
            ("email" in user || "first_name" in user);

        const event = ticket.event;
        const eventIsPopulated =
            event &&
            typeof event === "object" &&
            ("title" in event || "description" in event);

        this.id = ticket.id;
        this.reservationCode = ticket.reservationCode;
        this.user = userIsPopulated ? new UserDTO(user) : referenceId(user);
        this.event = eventIsPopulated ? new EventDTO(event) : referenceId(event);
        this.status = ticket.status;
        this.quantity = ticket.quantity;
        this.createdAt = ticket.createdAt;
    }
}