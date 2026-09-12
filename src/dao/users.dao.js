import usersRepository from "../repositories/users.repository.js";

class UserDAO {
  async findByEmail(email){
    return await usersRepository.getByEmail(email);
  }

  async getUserById(id){
    return await usersRepository.getById(id);
  }

  async createUser(userData) {
    return await usersRepository.create(userData);
  }
}

export default new UserDAO();