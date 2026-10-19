import { UserDTO } from "./user.dto.js";
import { referenceId } from "./reference.dto.js";
export class EventDTO {
    constructor(event){
        const organizer = event.organizer;
        const organizerIsPopulated =
            organizer &&
            typeof organizer === "object" &&
            ("email" in organizer || "first_name" in organizer);

        this.organizer = organizerIsPopulated
            ? new UserDTO(organizer)
            : referenceId(organizer);

        this.id = referenceId(event._id ?? event.id);
        this.title = event.title;
        this.description = event.description;
        this.category = event.category;
        this.date = event.date;
        this.location = event.location;
        this.price = event.price;
        this.capacity = event.capacity;
        this.status = event.status;
    }
}