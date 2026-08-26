import eventService from "../services/event.service.js";

export const create = async (req, res) => {
  try {
    const result = await eventService.create(req.body);

    return res.status(201).json({
      status: "success",
      payload: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await eventService.getAll();
    
    return res.status(200).json({
      status: "success",
      payload: result,
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

