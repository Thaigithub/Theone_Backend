import { $Enums, Prisma } from '@prisma/client';
import { BaseEntity } from './base.entity';

export class User extends BaseEntity implements Prisma.UserUncheckedCreateInput {
  constructor(username: string, password: string, name: string, type: $Enums.UserType, status: $Enums.UserStatus) {
    super();
    this.username = username;
    this.password = password;
    this.name = name;
    this.type = type;
    this.status = status;
  }

  id?: number;
  username: string;
  password: string;
  name: string;
  type: $Enums.UserType;
  status: $Enums.UserStatus;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  authenticationProviders?: Prisma.AuthenticationProviderUncheckedCreateNestedManyWithoutUserInput;
}
