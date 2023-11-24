import { Injectable } from '@nestjs/common';
import { PrismaModel } from 'domain/entities/prisma.model';
import { Company } from 'domain/entities/company.entity';
import { CompanyRepository } from 'domain/repositories/company.repository';
import { PrismaService } from '../services/prisma.service';
import { BaseRepositoryImpl } from './base.repository.impl';

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
}
