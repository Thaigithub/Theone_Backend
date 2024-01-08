import { AccountType } from '@prisma/client';

export class AuthAdminLoginResponse {
    token: string;
    uid: string;
    type: AccountType;
}
