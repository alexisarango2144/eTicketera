import { UserDAO } from "../dao/users.dao.js";

export class UserRepository {
  constructor() {
    this.dao = new UserDAO();
  }

  findByEmail(email) {
    return this.dao.findByEmail(email);
  }

  create(data) {
    return this.dao.create(data);
  }

  getById(id) {
    return this.dao.getById(id);
  }
}
