import User from "../models/user.model.js";

export class UserDAO {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async create(data){
    return User.create(data);
  }

  async getById(id){
    return User.findById(id);
  }
}
