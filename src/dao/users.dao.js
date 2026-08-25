import User from "../models/user.model.js";

class UserDAO {
  async findByEmail(email){
    return await User.findOne({
      email
    });
  }

  async create(userData) {
    return await User.create(
      userData
    );
  }
}

export default new UserDAO();