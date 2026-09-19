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

export const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);

    return res.status(200).json({
      status: "success",
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

    res.status(200).json({
      status: "success",
      message: "Evento actualizado con éxito",
      data: event
    })
  } catch (error) {
    next(error);
  }
};

export const changeEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if(!status) {
      return res.status(400).json({
        status: "error",
        message: "El campo status es obligatorio"
      })
    }

    const event = await eventService.changeStatus(
      req.params.id,
      status,
      req.user
    );

    res.json({
      status: "success",
      message: "Estado del evento actualizado",
      data: event
    })
  } catch (error) {
    next(error);
  }
};
