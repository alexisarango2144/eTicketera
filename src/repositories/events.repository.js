import eventDAO from "../dao/events.dao.js";

class EventsRepository {
  async getAll(){
    return await eventDAO
      .getAll();
  }

  async getById(id) {
    return await eventDAO
      .getById(id);
  }
  
  async findByTitle(titulo) {
    return await eventDAO
      .findByTitle(titulo);
  }

  async create(eventData) {
    return await eventDAO
      .create(eventData);
  }
}

export default new EventsRepository();