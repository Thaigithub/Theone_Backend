import { Injectable } from '@nestjs/common';
import { Account } from 'domain/account/account.entity';
import { AccountRepository } from 'domain/account/account.repository';
import { PrismaModel } from 'helpers/entity/prisma.model';
import { BaseRepositoryImpl } from '../../helpers/entity/base.repository.impl';
import { PrismaService } from '../../helpers/entity/prisma.service';

@Injectable()
export class AccountRepositoryImpl extends BaseRepositoryImpl<Account> implements AccountRepository {
    constructor(private readonly prismaService: PrismaService) {
        super(prismaService, PrismaModel.ACCOUNT);
    }

    async findByUsername(username: string): Promise<Account> {
        return await this.prismaService.account.findUnique({
            where: {
                username,
            },
        });
    }

    async findOne(accountId: number): Promise<Account> {
        return await this.prismaService.account.findUnique({
            where: { id: accountId },
        });
    }
}
