import mongoose from "mongoose";
import { EventRepository } from "../repositories/event.repository.js";
import { CustomError } from "../utils/custom-error.js";
import "dotenv/config";

const VALID_STATUSES = ["draft", "published", "cancelled", "finished"];

export class EventService {
  constructor() {
    this.eventRepository = new EventRepository();
  }

  validateObjectId(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new CustomError(
        "El identificador de evento proporcionado no es válido",
        400,
      );
    }
  }

  validateCapacityAndPrice(data) {
    if (data.capacity !== undefined && Number(data.capacity) <= 0) {
      throw new CustomError("La capacidad debe ser mayor a cero");
    }

    if (data.price !== undefined && data.price < 0) {
      throw new CustomError("El precio no puede ser negativo");
    }
  }

  validateStatus(status) {
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      throw new CustomError(
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
      throw new CustomError("Faltan campos obligatorios", 400);
    }

    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime())) {
      throw new CustomError("La fecha del evento no es válida");
    }

    if (eventDate <= new Date()) {
      throw new CustomError(
        "No se puee crear un evento con fecha anterior a la actual",
      );
    }

    this.validateCapacityAndPrice({ capacity, price });
    this.validateStatus(status);

    return this.eventRepository.create({
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
  }

  async getEventById(id) {
    this.validateObjectId(id);

    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new CustomError("No se encontró el evento", 404);
    }

    return event;
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
          throw new CustomError("Error: dateFrom no es una fecha válida");
        }
        filter.date.$gte = from;
      }

      if (dateTo) {
        const to = new Date(dateTo);
        if (Number.isNaN(to.getTime())) {
          throw new CustomError("Error: dateTo no es una fecha válida");
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
      throw new CustomError(
        `Campo de ordenamiento no válido. Los campos permitidos son: ${allowedSortFields.join(", ")}`,
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

    return {
      data,
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
      throw new CustomError(
        "No tienes permisos para modificar este evento",
        403,
      );
    }
  }

  async updateEvent(id, data, user) {
    const event = await this.getEventById(id);

    if (event.status === "cancelled") {
      throw new CustomError(
        "No se puede modificar el evento ya que se encuentra cancelado",
        409,
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

    this.validateCapacityAndPrice(updateData);

    if (Object.keys(updateData).length === 0) {
      throw new CustomError(
        "No se encontraron campos válidos para actualizar",
        409,
      );
    }

    return this.eventRepository.updateById(id, updateData);
  }

  async changeStatus(id, status, user) {
    const event = await this.getEventById(id);

    if (event.status === "cancelled") {
      throw new CustomError(
        "No se puede modificar el evento ya que se encuentra cancelado",
        409,
      );
    }

    await this.assertCanManage(event, user);

    this.validateStatus(status);

    if (status === "published" && event.status === "finished") {
      throw new CustomError("No se puede publicar un evento finalizado");
    }

    if (status === "published" && event.status === "cancelled") {
      throw new CustomError("No se puede publicar un evento cancelado");
    }

    if (event.status === status) {
      throw new CustomError(`El evento ta tiene status ${status}`);
    }

    return this.eventRepository.updateById(id, { status });
  }
}
