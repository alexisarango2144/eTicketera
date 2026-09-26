export class EventDTO {
    constructor(event){
        this.id = event.id;
        this.title = event.title;
        this.description = event.description;
        this.category = event.category;
        this.date = event.date;
        this.location = event.location;
        this.price = event.price;
        this.capacity = event.capacity;
        this.organizer = event.organizer;
        this.status = event.status;
    }
}