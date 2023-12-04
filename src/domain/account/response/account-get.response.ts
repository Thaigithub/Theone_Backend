import { AccountDTO } from 'domain/account/dto/account.dto';

export class GetAccountResponse {
    accounts: AccountDTO[];

    constructor(accounts: AccountDTO[]) {
        this.accounts = accounts;
    }
}
