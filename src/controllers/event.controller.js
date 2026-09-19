import { EventService } from "../services/event.service.js";

const eventService = new EventService();

export const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user);

    return res.status(201).json({
      status: "success",
      message: "Evento creado con éxito",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const result = await eventService.getEvents(req.query);

    return res.status(200).json({
      status: "success",
      message: "Eventos obtenidos con éxito",
      data: { ...result },
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res) => {
  try {
    const result = await eventService.getById(id);

    return res.status(200).json({
      status: "success",
      message: "Eventos obtenidos con éxito",
      payload: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateById = async (req, res) => {
  try {
    const result = await eventService.updateById(req.params.eventId, req.body);
  } catch (error) {}
};
