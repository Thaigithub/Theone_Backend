import { AccountDTO } from 'application/dtos/account.dto';

export class GetAccountResponse {
  accounts: AccountDTO[];

  constructor(accounts: AccountDTO[]) {
    this.accounts = accounts;
  }
}
