import Event from "../models/event.model.js";

class EventsRepository {
  async getAll(){
    return await Event
      .find();
  }

  async getById(id) {
    return await Event
      .findById(id);
  }

  async findByTitle(titulo){
    return await Event
      .find({
        titulo: { $regex: titulo, $options: "i"}
      })
  }

  async create(data){
    return await Event.create(data);
  }
}

export default new EventsRepository();