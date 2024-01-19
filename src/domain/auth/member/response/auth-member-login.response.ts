import { AccountType } from '@prisma/client';

export class AuthMemberLoginResponse {
    token: string;
    uid: string;
    type: AccountType;
}
