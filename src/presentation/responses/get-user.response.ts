import { UserDTO } from 'application/dtos/user.dto';

export class GetUserResponse {
  users: UserDTO[];

  constructor(users: UserDTO[]) {
    this.users = users;
  }
}
