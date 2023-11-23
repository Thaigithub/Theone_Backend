import { UpsertAccountRequest } from '../../presentation/requests/upsert-account.request';
import { AccountDTO } from '../dtos/account.dto';

export interface AccountUseCase {
  getAccounts(): Promise<AccountDTO[]>;
  createAccount(request: UpsertAccountRequest): Promise<void>;
}

export const AccountUseCase = Symbol('AccountUseCase');
