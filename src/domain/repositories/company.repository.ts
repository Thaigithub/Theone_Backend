import { Injectable } from '@nestjs/common';
import { Company } from '../entities/company.entity';
import { BaseRepository } from './base.repository';
import { CompanySearchRequest } from 'presentation/requests/admin-company.request';
import { $Enums } from '@prisma/client';

@Injectable()
export abstract class CompanyRepository extends BaseRepository<Company> {
  abstract findByEmail(email: string): Promise<Company>;
  abstract findOne(id: number): Promise<Company>;
  abstract findRequest(request: CompanySearchRequest): Promise<Company[]>
  abstract updateStatus(companyId: number, status: $Enums.AccountStatus): Promise<void>
}
