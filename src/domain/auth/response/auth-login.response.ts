import { AccountType } from '@prisma/client';

export class AuthLoginResponse {
    token: string;
    uid: string;
    type: AccountType;
}
