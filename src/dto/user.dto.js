export class AccountDTO {
  constructor(user){
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
  }
}
export class UserDTO extends AccountDTO {
  constructor(user){
    super(user);
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.role = user.role;
  }
}