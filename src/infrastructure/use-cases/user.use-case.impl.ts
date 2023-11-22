import { Inject, Injectable, Logger } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';
import { hash } from 'bcrypt';
import { AccountDTO } from '../../application/dtos/user.dto';
import { UserUseCase } from '../../application/use-cases/user.use-case';
import { Account } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UpsertUserRequest } from '../../presentation/requests/upsert-user.request';

@Injectable()
export class UserUseCaseImpl implements UserUseCase {
  private readonly logger = new Logger(UserUseCaseImpl.name);

  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  async getUsers(): Promise<AccountDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => AccountDTO.from(user));
  }

  async createUser(request: UpsertUserRequest): Promise<void> {
    const user = new Account(request.username, await hash(request.password, 10), request.name, AccountType.CUSTOMER, AccountStatus.PENDING);
    await this.userRepository.create(user);
  }
}
