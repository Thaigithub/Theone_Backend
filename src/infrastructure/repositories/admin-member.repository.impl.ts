import { Injectable } from '@nestjs/common';
import { PrismaModel } from '../../domain/entities/prisma.model';
import { PrismaService } from '../services/prisma.service';
import { BaseRepositoryImpl } from './base.repository.impl';
import { AdminMemberRepository } from 'domain/repositories/admin-member.repository';
import { AdminMemberRequest } from 'presentation/requests/admin-member.request';

@Injectable()
export class AdminMemberRepositoryImpl extends BaseRepositoryImpl<any> implements AdminMemberRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.USER);
  }

  async findByQuery(query: AdminMemberRequest): Promise<any> {
    let searchCategoryQuery: {};
    switch (query.searchCategory) {
      case 'id':
        searchCategoryQuery = { username: { contains: query.keyword } };
        break;
      case 'name':
        searchCategoryQuery = { name: { contains: query.keyword } };
        break;
      case undefined:
        searchCategoryQuery = {
          OR: [
            { username: { contains: query.keyword } },
            { name: { contains: query.keyword } }
          ],
        }
    }

    return await this.prismaService.account.findMany({
      where: {
        ...searchCategoryQuery,
        status: query.status,
      },
    });
  }
}
