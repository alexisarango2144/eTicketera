import eventsRepository from "../repositories/events.repository.js";
import { CustomError } from "../utils/custom-error.js";
import "dotenv/config";

class EventService {
  async getAll() {
    const data = await eventsRepository
      .getAll();

    return {
      events: data
    }
  }

  async create(data) {
    const {
      titulo,
      descripcion,
      categoria,
      capacidad_maxima
    } = data || {};

    if (!titulo || !descripcion) {
      throw new CustomError("Faltan campos obligatorios", 400);
    }


    const event = await eventsRepository
      .create({
        titulo,
        descripcion,
        categoria,
        capacidad_maxima
      });

    return {
      id: event._id,
      titulo: event.titulo,
      descripcion: event.descripcion,
      categoria: event.categoria,
      capacidad_maxima: event.capacidad_maxima
    };

  }
}

export default new EventService();