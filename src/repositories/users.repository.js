import User from "../models/user.model.js";

class UsersRepository {
  async getById(id) {
    return await User
      .findById(id);
  }
  
  async getByEmail(email) {
    return await User
      .findOne({email});
  }

  async create(userData) {
    return await User
      .create(userData);
  }
}

export default new UsersRepository();