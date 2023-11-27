import { CompanyDownloadRequest, CompanySearchRequest } from 'presentation/requests/admin-company.request';
import { CompanyDTO } from '../dtos/company.dto';
import { $Enums } from '@prisma/client';
import { Response } from 'express'
export interface CompanyUseCase {
  getCompanies(request: CompanySearchRequest): Promise<CompanyDTO[]>;
  getDetails(CompanyId: number): Promise<CompanyDTO>;
  changeStatus(CompanyId: number, status: $Enums.AccountStatus): Promise<void>;
  download(request: CompanyDownloadRequest, response: Response): Promise<void>;
}

export const CompanyUseCase = Symbol('CompanyUseCase');
