import { CompanyDTO } from '../dtos/company.dto';
export interface CompanyUseCase {
  getCompanies(): Promise<CompanyDTO[]>;
  getDetails(CompanyId:number): Promise<CompanyDTO>;
}

export const CompanyUseCase = Symbol('CompanyUseCase');