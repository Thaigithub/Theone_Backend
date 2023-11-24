import { Inject, Injectable} from '@nestjs/common';
import { CompanyDTO } from 'application/dtos/company.dto';
import { CompanyRepository } from 'domain/repositories/company.repository';
import { CompanyUseCase } from 'application/use-cases/company.use-case';
@Injectable()
export class CompanyUseCaseImpl implements CompanyUseCase {
    constructor(@Inject(CompanyRepository) private readonly companyRepository: CompanyRepository) {}
    async getCompanies(): Promise<CompanyDTO[]>{
        const companies = await this.companyRepository.findAll();
        return companies.map(account => CompanyDTO.from(account));
    }
    async getDetails(CompanyId:number): Promise<CompanyDTO>{
        return await this.companyRepository.findOne(CompanyId);
    }
}
