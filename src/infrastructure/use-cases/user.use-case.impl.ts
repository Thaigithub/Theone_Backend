import { Inject, Injectable, Logger } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';
import { hash } from 'bcrypt';
import { UserDTO } from '../../application/dtos/user.dto';
import { UserUseCase } from '../../application/use-cases/user.use-case';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UpsertUserRequest } from '../../presentation/requests/upsert-user.request';

@Injectable()
export class UserUseCaseImpl implements UserUseCase {
  private readonly logger = new Logger(UserUseCaseImpl.name);

  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  async getUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => UserDTO.from(user));
  }

  async createUser(request: UpsertUserRequest): Promise<void> {
    const user = new User(request.username, await hash(request.password, 10), request.name, AccountType.CUSTOMER, AccountStatus.PENDING);
    await this.userRepository.create(user);
  }
}
