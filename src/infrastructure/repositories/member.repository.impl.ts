import { Injectable } from '@nestjs/common';
import { PrismaModel } from '../../domain/entities/prisma.model';
import { PrismaService } from '../services/prisma.service';
import { BaseRepositoryImpl } from './base.repository.impl';
import { AdminMemberRepository } from 'domain/repositories/member.repository';
import { AdminMemberRequest, SearchCategory } from 'presentation/requests/admin-member.request';
import { AccountType } from '@prisma/client';

@Injectable()
export class AdminMemberRepositoryImpl extends BaseRepositoryImpl<any> implements AdminMemberRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.ACCOUNT);
  }

  async findByQuery(query: AdminMemberRequest): Promise<any> {
    return await this.prismaService.account.findMany({
      // Retrieve specific fields
      select: {
        username: true,
        status: true,
        member: {
          select: {
            name: true,
            contact: true,
            level: true,
          },
        },
      },

      // Conditions based on request query
      where: {
        type: AccountType.MEMBER,
        status: query.status,
        username: query.searchCategory === SearchCategory.id ? {
          contains: query.searchKeyword
        } : undefined,
        member: {
          name: query.searchCategory === SearchCategory.name ? {
            contains: query.searchKeyword
          } : undefined,
          level: query.level,
        },
      },

      // Pagination
      // If both pageNumber and pageSize is provided then handle the pagination
      skip: query.pageNumber && query.pageSize ? (query.pageNumber - 1) * query.pageSize : undefined,
      take: query.pageNumber && query.pageSize ? query.pageSize : undefined
    });
  }
}
