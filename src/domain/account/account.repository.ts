import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../helpers/entity/base.repository';
import { Account } from './account.entity';

@Injectable()
export abstract class AccountRepository extends BaseRepository<Account> {
    abstract findByUsername(username: string): Promise<Account>;
    abstract findOne(id: number): Promise<Account>;
}
