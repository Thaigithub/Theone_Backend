import { AccountStatus, AccountType } from '@prisma/client';
<<<<<<< HEAD:src/application/dtos/user.dto.ts
import { User } from '../../domain/entities/user.entity';
=======
import { Account } from '../../domain/entities/account.entity';
>>>>>>> origin/develop:src/application/dtos/account.dto.ts
import { GenUID } from 'common/utils/uid';
import { DbType } from 'common/constant';

export class AccountDTO {
  id: number;
  username: string;
  name: string;
  type: AccountType;
  status: AccountStatus;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;

  constructor(
    id: number,
    username: string,
    name: string,
    type: AccountType,
    status: AccountStatus,
    isActive: boolean,
    createdAt: Date | string,
    updatedAt: Date | string,
  ) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.type = type;
    this.status = status;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static from(domain: Account): AccountDTO {
    return new AccountDTO(domain.id, domain.username, domain.name, domain.type, domain.status, domain.isActive, domain.createdAt, domain.updatedAt);
  }
}

export const fakeUidAccount = (accountId: number): string => {
  return GenUID(accountId, DbType.Account, 0).toString();
};
