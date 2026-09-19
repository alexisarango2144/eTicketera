import User from "../models/user.model.js";

export class UserDAO {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(data){
    return await User.create(data);
  }

  async getById(id){
    return await User.findById(id);
  }
}
