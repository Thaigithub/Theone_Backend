import { AccountType } from '@prisma/client';

export class AuthCompanyLoginResponse {
    token: string;
    uid: string;
    type: AccountType;
}
