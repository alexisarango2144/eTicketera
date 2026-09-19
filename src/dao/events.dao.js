import Event from "../models/event.model.js";

export class EventDAO {
  async create(data) {
    return await Event.create(data);
  }

  async getById(id) {
    return await Event.findById(id).populate(
      "organizer",
      "first_name last_name email role",
    );
  }

  async updateById(id, data) {
    return await Event.findByIdAndUpdate(id, data, { new: true }).populate(
      "organizer",
      "first_name last_name email role",
    );
  }

  async findAll(filter, { skip, limit, sort }) {
    return await Event.find(filter)
      .populate("organizer", "first_name last_name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async count(filter) {
    return await Event.countDocuments(filter);
  }

  async reserveSeats(eventId, seats) {
    return await Event.findOneAndUpdate(
      {
        _id: eventId,
        status: "published",
        date: { $gt: new Date() },
        $expr: {
          $lte: [{ $add: ["$reserved", seats] }, "$capacity"],
        },
      },
      { $inc: { reserved: seats } },
      { new: true },
    );
  }

  async releaseSeats(eventId, seats) {
    return await Event.findOneAndUpdate(
      { _id: eventId, reserved: { $gte: seats } },
      { $inc: { reserved: -seats } },
      { new: true },
    );
  }
}