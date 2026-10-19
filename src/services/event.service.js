import mongoose from "mongoose";
import { EventRepository } from "../repositories/event.repository.js";
import { CustomError } from "../utils/custom-error.js";
import { EventDTO } from "../dto/event.dto.js";
import "dotenv/config";

const VALID_STATUSES = ["draft", "published", "cancelled", "finished"];

export class EventService {
  constructor() {
    this.eventRepository = new EventRepository();
  }

  validateObjectId(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw CustomError.badRequest(
        "El identificador de evento proporcionado no es válido"
      );
    }
  }

  validateCapacityAndPrice(data) {
    if (data.capacity !== undefined && Number(data.capacity) <= 0) {
      throw CustomError.badRequest("La capacidad debe ser mayor a cero");
    }

    if (data.price !== undefined && data.price < 0) {
      throw CustomError.badRequest("El precio no puede ser negativo");
    }
  }

  validateStatus(status) {
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      throw CustomError.badRequest(
        `El estado seleccionado no es válido. Los valores permitidos son: ${VALID_STATUSES.join(", ")}`,
      );
    }
  }

  async createEvent(data, user) {
    const {
      title,
      description,
      category,
      date,
      location,
      capacity,
      price,
      status = "draft",
    } = data || {};

    if (!title || !description || !category || !date || !location) {
      throw CustomError.badRequest("Faltan campos obligatorios");
    }

    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime())) {
      throw CustomError.badRequest("La fecha del evento no es válida");
    }

    if (eventDate <= new Date()) {
      throw CustomError.badRequest(
        "No se puee crear un evento con fecha anterior a la actual",
      );
    }

    this.validateCapacityAndPrice({ capacity, price });
    this.validateStatus(status);

    const event = await this.eventRepository.create({
      title,
      description,
      category,
      date: eventDate,
      location,
      capacity,
      price,
      status,
      organizer: user._id,
    });

    return new EventDTO(event);
  }

  async getEventById(id) {
    this.validateObjectId(id);

    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw CustomError.notFound("No se encontró el evento");
    }

    return new EventDTO(event);
  }

  async getEvents(query) {
    const {
      status,
      category,
      location,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = "date",
    } = query || {};

    this.validateStatus(status);

    const currentPage = Math.max(Number(page) || 1, 1);
    const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = { $regex: category, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };

    if (dateFrom || dateTo) {
      filter.date = {};

      if (dateFrom) {
        const from = new Date(dateFrom);
        if (Number.isNaN(from.getTime())) {
          throw CustomError.badRequest("Error: dateFrom no es una fecha válida");
        }
        filter.date.$gte = from;
      }

      if (dateTo) {
        const to = new Date(dateTo);
        if (Number.isNaN(to.getTime())) {
          throw CustomError.badRequest("Error: dateTo no es una fecha válida");
        }
        filter.date.$lte = to;
      }
    }

    const allowedSortFields = [
      "date",
      "price",
      "title",
      "category",
      "location",
    ];
    const sortField = sort.startsWith("-") ? sort.slice(1) : sort;

    if (!allowedSortFields.includes(sortField)) {
      throw CustomError.badRequest(
        `Campo de ordenamiento no válido. Los campos permitidos son: ${allowedSortFields.join(", ")}`,
        400,
      );
    }

    const sortObject = {
      [sortField]: sort.startsWith("-") ? -1 : 1,
    };

    const skip = (currentPage - 1) * currentLimit;

    const [data, total] = await Promise.all([
      this.eventRepository.findAll(filter, {
        skip,
        limit: currentLimit,
        sort: sortObject,
      }),
      this.eventRepository.count(filter),
    ]);

    const eventDTOs = data.map((event) => new EventDTO(event));

    return {
      items: eventDTOs,
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  async assertCanManage(event, user) {
    const isAdmin = user.role === "admin";

    if (isAdmin) return;

    const isOwner = event.organizer?._id
      ? event.organizer._id.toString() === user._id.toString()
      : event.organizer.toString() === user._id.toString();

    if (!isOwner) {
      throw CustomError.forbidden(
        "No tienes permisos para modificar este evento"
      );
    }
  }

  async updateEvent(id, data, user) {
    const {
      title,
      description,
      category,
      date,
      location,
      capacity,
      price,
      status
    } = data || {};

    if (!title || !description || !category || !date || !location) {
      throw CustomError.badRequest("Faltan campos obligatorios");
    }

    const event = await this.getEventById(id);

    if (event.status === "cancelled") {
      throw CustomError.conflict(
        "No se puede modificar el evento ya que se encuentra cancelado"
      );
    }

    await this.assertCanManage(event, user);

    const allowedFields = [
      "title",
      "description",
      "category",
      "date",
      "location",
      "capacity",
      "price",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    if(updateData.date !== undefined){
      const newDate = new Date(updateData.date);

      if (Number.isNaN(newDate.getTime())) {
        throw CustomError.badRequest("La fecha del evento no es válida");
      }

      if(newDate <= new Date()){
        throw CustomError.badRequest("No se puede actualizar el evento a una fecha anterior a la actual");
      }

      updateData.date = newDate;
    }

    this.validateCapacityAndPrice(updateData);

    if (Object.keys(updateData).length === 0) {
      throw CustomError.badRequest(
        "No se encontraron campos válidos para actualizar"
      );
    }

    const updatedEvent = await this.eventRepository.updateById(id, updateData);
    return new EventDTO(updatedEvent);
  }

  async changeStatus(id, status, user) {
    if(!status) {
      throw CustomError.badRequest("El campo status es obligatorio");
    }

    const event = await this.getEventById(id);

    if (event.status === "cancelled") {
      throw CustomError.conflict(
        "No se puede modificar el evento ya que se encuentra cancelado"
      );
    }

    await this.assertCanManage(event, user);

    this.validateStatus(status);

    if (status === "published" && event.status === "finished") {
      throw CustomError.badRequest("No se puede publicar un evento finalizado");
    }

    if (status === "published" && event.status === "cancelled") {
      throw CustomError.badRequest("No se puede publicar un evento cancelado");
    }

    if (event.status === status) {
      throw CustomError.conflict(`El evento ya tiene el status ${status}`);
    }

    const updatedEvent = await this.eventRepository.updateById(id, { status });
    return new EventDTO(updatedEvent);
  }
}
