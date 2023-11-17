
import { $Enums, Prisma, UserStatus, UserType } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { UpsertUserRequest } from "../../presentation/requests/upsert-user.request";
import { BaseEntity } from "./base.entity";

export class User extends BaseEntity implements Prisma.UserGetPayload<Prisma.UserDefaultArgs<DefaultArgs>> {
  id: number
  username: string
  name: string
  password: string;
  type: $Enums.UserType
  status: $Enums.UserStatus
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  constructor(
    id: number,
    username: string,
    name: string,
    type: $Enums.UserType,
    status: $Enums.UserStatus,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    super()
    this.id = id
    this.username = username
    this.name = name
    this.type = type
    this.status = status
    this.isActive = isActive
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }


  static from(request : UpsertUserRequest) : User {
    return new User(
      0,
      request.username,
      request.name,
      UserType.CUSTOMER,
      UserStatus.PENDING,
      false,
      new Date(),
      new Date()
    )
  }
}