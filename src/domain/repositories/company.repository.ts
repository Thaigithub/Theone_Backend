import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { CompanyDownloadRequest, CompanySearchRequest } from 'presentation/requests/admin-company.request';
import { CompanyDetailsResponse, CompanySearchResponse } from 'presentation/responses/company.response';
import { $Enums, Account, Company } from '@prisma/client';

@Injectable()
export abstract class CompanyRepository extends BaseRepository<Company> {
  abstract findByEmail(email: string): Promise<CompanyByEmail>;
  abstract findOne(id: number): Promise<CompanyDetailsResponse>;
  abstract findRequest(request: CompanySearchRequest): Promise<CompanySearchResponse>;
  abstract updateStatus(companyId: number, status: $Enums.AccountStatus): Promise<void>;
  abstract findByIds(request: CompanyDownloadRequest): Promise<CompanyDetailsResponse[]>;
  abstract countRequest(equest: CompanySearchRequest): Promise<number>;
}

export type CompanyByEmail = {
  id: Account['id'];
  type: Account['type'];
};
