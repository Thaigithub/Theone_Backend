import { Injectable, Logger } from "@nestjs/common";
import { UserDTO } from "../../application/dtos/user.dto";
import { UserUseCase } from "../../application/use-cases/user.use-case";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UpsertUserRequest } from "../../presentation/requests/upsert-user.request";

@Injectable()
export class UserUseCaseImpl implements UserUseCase {
  private readonly logger = new Logger(UserUseCaseImpl.name)

  constructor(
    private readonly userRepository : UserRepository
  ){}


  async getUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => UserDTO.from(user))
  }

  async createUser(request: UpsertUserRequest): Promise<void> {
    await this.userRepository.create(User.from(request))
  }


}