import { CompanySearchRequest } from 'presentation/requests/company.request';
import { CompanyDTO } from '../dtos/company.dto';
export interface CompanyUseCase {
  getCompanies(request: CompanySearchRequest): Promise<CompanyDTO[]>;
  getDetails(CompanyId:number): Promise<CompanyDTO>;
}

export const CompanyUseCase = Symbol('CompanyUseCase');