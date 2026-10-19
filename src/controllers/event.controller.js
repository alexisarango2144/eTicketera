import { EventService } from "../services/event.service.js";
import { sendSuccess } from "../utils/api-response.js";

const eventService = new EventService();

export const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user);

    return sendSuccess(res, {
      statusCode: 201,
      message: "Evento creado con éxito",
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const result = await eventService.getEvents(req.query);
    
    return sendSuccess(res, {
      statusCode: 200,
      message: "Eventos obtenidos con éxito",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.eventId);

    return sendSuccess(res, {
      statusCode: 200,
      message: "Evento obtenido con éxito",
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(
      req.params.eventId, 
      req.body,
      req.user
    );

    return sendSuccess(res, {
      statusCode: 200,
      message: "Evento actualizado con éxito",
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const changeEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const event = await eventService.changeStatus(
      req.params.eventId,
      status,
      req.user
    );

    return sendSuccess(res, {
      statusCode: 200,
      message: "Estado del evento actualizado",
      data: event
    });
  } catch (error) {
    next(error);
  }
};
