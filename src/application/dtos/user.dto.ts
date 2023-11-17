import { $Enums } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";

export class UserDTO {
  id: number
  username: string
  name: string
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
    this.id = id
    this.username = username
    this.name = name
    this.type = type
    this.status = status
    this.isActive = isActive
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
  

  static from(domain: User): UserDTO {
    return new UserDTO(
      domain.id,
      domain.username,
      domain.name,
      domain.type,
      domain.status,
      domain.isActive,
      domain.createdAt,
      domain.updatedAt
    )
  }
}