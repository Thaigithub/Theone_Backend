import { Injectable } from '@nestjs/common';
import { PrismaModel } from 'domain/entities/prisma.model';
import { Company } from 'domain/entities/company.entity';
import { CompanyRepository } from 'domain/repositories/company.repository';
import { PrismaService } from '../services/prisma.service';
import { BaseRepositoryImpl } from './base.repository.impl';
import { CompanySearchRequest } from 'presentation/requests/admin-company.request';
import { $Enums } from '@prisma/client';
@Injectable()
export class CompanyRepositoryImpl extends BaseRepositoryImpl<Company> implements CompanyRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.ACCOUNT);
  }
  async findByEmail(email: string): Promise<Company> {
    return await this.prismaService.company.findUnique({
      where: {
        email,
        isActive:true
      },
    });
  }
  async findOne(id: number): Promise<Company> {
    return await this.prismaService.company.findUnique({
      where: {
        id,
        isActive:true
      },
      include: {
        account: true,
      },
    });
  }
  async findRequest(request: CompanySearchRequest): Promise<Company[]> {
    const query = {
      take: request.pageSize !== undefined ? parseInt(request.pageSize) : 100,
    };
    if (request.pageNumber) {
      query['skip'] = parseInt(request.pageNumber) * query['take'];
    }
    ['pageNumber', 'pageSize'].forEach(key => delete request[key]);

    query['where'] = Object.keys(request)
      .map(key => {
        if (request[key] !== undefined) return { [key]: request[key] };
      })
      .filter(value => value !== undefined)
      .reduce((acc, object) => {
        const key = Object.keys(object)[0];
        if (key === 'status') {
          switch (object[key]) {
            case 'SUSPENDED':
              object[key] = $Enums.AccountStatus.SUSPENDED;
            case 'WITHDRAWN':
              object[key] = $Enums.AccountStatus.WITHDRAWN;
            default:
              object[key] = $Enums.AccountStatus.APPROVED;
          }
          acc['account'] = { [key]: object[key] };
          return acc;
        }
        if (key === 'id') object[key] = parseInt(object[key]);
        acc[key] = object[key];
        return acc;
      }, {});
    query['where']['isActive'] = true
    return await this.prismaService.company.findMany(query);
  }
  async updateStatus(companyId: number, status: $Enums.AccountStatus): Promise<void> {
    await this.prismaService.account.update({
      where: {
        id: companyId,
        isActive: true
      },
      data: { status: status } });
  }
}
