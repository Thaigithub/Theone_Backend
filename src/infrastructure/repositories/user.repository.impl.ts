import { Injectable } from '@nestjs/common';
import { PrismaModel } from '../../domain/entities/prisma.model';
import { Account } from '../../domain/entities/account.entity';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { PrismaService } from '../services/prisma.service';
import { BaseRepositoryImpl } from './base.repository.impl';

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
