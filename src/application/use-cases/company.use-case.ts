import { CompanySearchRequest } from 'presentation/requests/admin-company.request';
import { CompanyDTO } from '../dtos/company.dto';
import { $Enums } from '@prisma/client';
export interface CompanyUseCase {
  getCompanies(request: CompanySearchRequest): Promise<CompanyDTO[]>;
  getDetails(companyId: number): Promise<CompanyDTO>;
  changeStatus(companyId: number, status: $Enums.AccountStatus): Promise<void>;
}

export const CompanyUseCase = Symbol('CompanyUseCase');
