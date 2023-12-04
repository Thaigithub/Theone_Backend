import { Inject, Injectable, Logger } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';
import { hash } from 'bcrypt';
import { Account } from 'domain/account/account.entity';
import { AccountRepository } from 'domain/account/account.repository';
import { AccountUseCase } from 'domain/account/account.usecase';
import { AccountDTO } from 'domain/account/dto/account.dto';
import { AccountUpsertRequest } from 'domain/account/request/account-upsert.request';

@Injectable()
export class AccountUseCaseImpl implements AccountUseCase {
    private readonly logger = new Logger(AccountUseCaseImpl.name);

    constructor(@Inject(AccountRepository) private readonly accountRepository: AccountRepository) {}

    async getAccounts(): Promise<AccountDTO[]> {
        const accounts = await this.accountRepository.findAll();
        return accounts.map((account) => AccountDTO.from(account));
    }

    async createAccount(request: AccountUpsertRequest): Promise<void> {
        const account = new Account(
            request.username,
            await hash(request.password, 10),
            AccountType.MEMBER,
            AccountStatus.PENDING,
        );
        await this.accountRepository.create(account);
    }
}
