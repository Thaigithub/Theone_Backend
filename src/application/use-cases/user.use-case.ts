import { UpsertUserRequest } from '../../presentation/requests/upsert-user.request';
import { UserDTO } from '../dtos/user.dto';

export interface UserUseCase {
  getUsers(): Promise<UserDTO[]>;
  createUser(request: UpsertUserRequest): Promise<void>;
}

export const UserUseCase = Symbol('UserUseCase');
