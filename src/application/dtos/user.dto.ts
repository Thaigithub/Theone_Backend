import { UserStatus, UserType } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import { GenUID } from 'common/utils/uid';
import { DbType } from 'common/constant';

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

export const fakeUidUser = (userId: number): string => {
  return GenUID(userId, DbType.User, 0).toString();
};
