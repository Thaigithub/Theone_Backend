import { Inject, Injectable} from '@nestjs/common';
import { CompanyDTO } from 'application/dtos/company.dto';
import { CompanyRepository } from 'domain/repositories/company.repository';
import { CompanyUseCase } from 'application/use-cases/company.use-case';
import { CompanySearchRequest } from 'presentation/requests/admin-company.request';
import { $Enums } from '@prisma/client';
@Injectable()
export class CompanyUseCaseImpl implements CompanyUseCase {
    constructor(@Inject(CompanyRepository) private readonly companyRepository: CompanyRepository) {}
    async getCompanies(request: CompanySearchRequest): Promise<CompanyDTO[]>{
        const companies = await this.companyRepository.findRequest(request);
        return companies.map(company => CompanyDTO.from(company));
    }
    async getDetails(CompanyId:number): Promise<CompanyDTO>{
        return await this.companyRepository.findOne(CompanyId);
    }
    async changeStatus(CompanyId:number, status:$Enums.AccountStatus): Promise<void>{
        await this.companyRepository.updateStatus(CompanyId, status);
    }
}
