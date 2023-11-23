import { AccountType } from '@prisma/client';

export class LoginResponse {
  token: string;
  uid: string;
  type: AccountType;
}
