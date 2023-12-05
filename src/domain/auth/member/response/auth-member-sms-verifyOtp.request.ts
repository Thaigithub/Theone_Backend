import { Account } from '@prisma/client';

export class UserIdSmsResponse {
    userName: Account['username'];
    uid: string;
}

export class PasswordSmsResponse {
    success: boolean;
    uid: string;
}
