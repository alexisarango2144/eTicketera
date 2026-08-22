class EventsController {
  getAllEvents = async(req, res, next)=>{
    const response = {
      "status": "success",
      "payload": [] 
    };
    res.status(200).json(response);
  }
}

export const eventsController = new EventsController();