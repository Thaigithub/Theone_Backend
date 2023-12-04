import { $Enums } from '@prisma/client';
import { CompanyDownloadRequest, CompanySearchRequest } from 'domain/company/request/admin-company.request';
import { CompanyDetailsResponse, CompanyResponse } from 'domain/company/response/company.response';
import { Response } from 'express';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
export interface CompanyUseCase {
    getCompanies(request: CompanySearchRequest): Promise<PaginationResponse<CompanyResponse>>;
    getDetails(companyId: number): Promise<CompanyDetailsResponse>;
    changeStatus(companyId: number, status: $Enums.AccountStatus): Promise<void>;
    download(request: CompanyDownloadRequest, response: Response): Promise<void>;
}

export const CompanyUseCase = Symbol('CompanyUseCase');
