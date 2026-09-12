import eventRepository from "../repositories/events.repository.js";

class EventDAO {
  
  async getAll(){
    return await eventRepository.getAll();
  }

  async getById(id){
    return await eventRepository.getById(id);
  }

  async findByTitle(titulo){
    return await eventRepository.findByTitle(titulo);
  }

  async create(data){
    return await eventRepository.create(data);
  }
}

export default new EventDAO();