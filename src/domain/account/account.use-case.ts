import { AccountUpsertRequest } from 'domain/account/request/account-upsert.request';
import { AccountDTO } from './dto/account.dto';

export interface AccountUseCase {
    getAccounts(): Promise<AccountDTO[]>;
    createAccount(request: AccountUpsertRequest): Promise<void>;
}

export const AccountUseCase = Symbol('AccountUseCase');
