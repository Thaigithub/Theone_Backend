import { UserStatus, UserType } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';

export class UserDTO {
  id: number;
  username: string;
  name: string;
  type: UserType;
  status: UserStatus;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;

  constructor(
    id: number,
    username: string,
    name: string,
    type: UserType,
    status: UserStatus,
    isActive: boolean,
    createdAt: Date | string,
    updatedAt: Date | string,
  ) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.type = type;
    this.status = status;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static from(domain: User): UserDTO {
    return new UserDTO(domain.id, domain.username, domain.name, domain.type, domain.status, domain.isActive, domain.createdAt, domain.updatedAt);
  }
}
