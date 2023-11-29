import { CompanyDownloadRequest, CompanySearchRequest } from 'presentation/requests/admin-company.request';
import { $Enums } from '@prisma/client';
import { Response } from 'express';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';
import { CompanyDetailsResponse, CompanyResponse } from 'presentation/responses/company.response';
export interface CompanyUseCase {
  getCompanies(request: CompanySearchRequest): Promise<PaginationResponse<CompanyResponse>>;
  getDetails(companyId: number): Promise<CompanyDetailsResponse>;
  changeStatus(companyId: number, status: $Enums.AccountStatus): Promise<void>;
  download(request: CompanyDownloadRequest, response: Response): Promise<void>;
}

export const CompanyUseCase = Symbol('CompanyUseCase');
