import { Inject, Injectable, Logger } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';
import { hash } from 'bcrypt';
import { AccountDTO } from 'application/dtos/account.dto';
import { AccountUseCase } from 'application/use-cases/account.use-case';
import { Account } from 'domain/entities/account.entity';
import { AccountRepository } from 'domain/repositories/account.repository';
import { UpsertAccountRequest } from 'presentation/requests/upsert-account.request';

@Injectable()
export class AccountUseCaseImpl implements AccountUseCase {
  private readonly logger = new Logger(AccountUseCaseImpl.name);

  constructor(@Inject(AccountRepository) private readonly accountRepository: AccountRepository) {}

  async getAccounts(): Promise<AccountDTO[]> {
    const accounts = await this.accountRepository.findAll();
    return accounts.map(account => AccountDTO.from(account));
  }

  async createAccount(request: UpsertAccountRequest): Promise<void> {
    const account = new Account(request.username, await hash(request.password, 10), request.name, AccountType.CUSTOMER, AccountStatus.PENDING);
    await this.accountRepository.create(account);
  }
}
