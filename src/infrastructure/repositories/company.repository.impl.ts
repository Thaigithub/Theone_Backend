import { Injectable } from '@nestjs/common';
import { PrismaModel } from 'domain/entities/prisma.model';
import { Company } from 'domain/entities/company.entity';
import { CompanyRepository } from 'domain/repositories/company.repository';
import { PrismaService } from '../services/prisma.service';
import { BaseRepositoryImpl } from './base.repository.impl';
import { CompanySearchRequest } from 'presentation/requests/company.request';

@Injectable()
export class CompanyRepositoryImpl extends BaseRepositoryImpl<Company> implements CompanyRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.ACCOUNT);
  }
  async findByEmail(email: string): Promise<Company> {
    return await this.prismaService.company.findUnique({
      where: {
        email
      },
    });
  }
  async findOne(id: number): Promise<Company> {
    return await this.prismaService.company.findUnique({
      where: {
        id
      },
      include:{
        account: true
      }
    });
  }
  async findRequest(request: CompanySearchRequest): Promise<Company[]> {
    const take = parseInt(request.pagesize)
    const skip = parseInt(request.pagenumber)*take;
    ['pagenumber','pagesize'].forEach(key=>delete request[key])
    return await this.prismaService.company.findMany({
      where: Object.keys(request).map(key=> {
        if (key!==null) return {key:request[key]}
      }).reduce((object,acc)=>{
        return acc[Object.keys(object)[0]]=object[Object.keys(object)[0]]
      },{}),
      skip: skip,
      take: take
    })
  }
}
