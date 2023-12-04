import { Injectable } from '@nestjs/common';
import { $Enums, Account, Company } from '@prisma/client';
import { CompanyDownloadRequest, CompanySearchRequest } from 'domain/company/request/admin-company.request';
import { CompanyDetailsResponse, CompanySearchResponse } from 'domain/company/response/company.response';
import { BaseRepository } from '../../helpers/entity/base.repository';

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
