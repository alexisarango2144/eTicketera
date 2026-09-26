import Ticket from "../models/ticket.model.js";

export class TicketDAO {
  async create(data) {
    return Ticket.create(data);
  }

  async findByUserAndEvent(userId, eventId, status) {
    return Ticket.findOne({ user: userId, event: eventId, status });
  }

  async getById(id) {
    return Ticket.findById(id).populate("event");
  }

  async findByUser(userId, filter, { skip, limit, sort }) {
    return Ticket.find({ user: userId, ...filter })
      .populate("event", "title date location")
      .sort(sort)
      .skip(skip)
      .limit(limit);  }

  async findByEvent(eventId) {
    return Ticket.find({ event: eventId })
      .populate("user", "first_name last_name email")
      .sort({ createdAt: -1 });
  }

  async save(ticket) {
    return ticket.save();
  }

  async count(userId, filter) {
    return Ticket.countDocuments({ user: userId || null, ...filter });
  }

  async sumReservedByEvent(eventId) {
    const result = await Ticket.aggregate([
      { $match: { event: eventId, status: "confirmed" } },
      { $group: { _id: "$event", totalReserved: { $sum: "$quantity" } } },
    ]);

    return result[0]?.totalReserved || 0;
  }
}
