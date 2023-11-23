import { Injectable } from '@nestjs/common';
import { Account } from '../entities/account.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export abstract class AccountRepository extends BaseRepository<Account> {
  abstract findByUsername(username: string): Promise<Account>;
  abstract findOne(id: number): Promise<Account>;
}
