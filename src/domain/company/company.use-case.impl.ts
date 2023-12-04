import { Inject, Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { CompanyRepository } from 'domain/company/company.repository';
import { CompanyUseCase } from 'domain/company/company.use-case';
import { CompanyDownloadRequest, CompanySearchRequest } from 'domain/company/request/admin-company.request';
import { CompanyDetailsResponse, CompanyResponse } from 'domain/company/response/company.response';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
@Injectable()
export class CompanyUseCaseImpl implements CompanyUseCase {
    constructor(
        @Inject(CompanyRepository) private readonly companyRepository: CompanyRepository,
        @Inject(ExcelService) private readonly excelService: ExcelService,
    ) {}
    async getCompanies(request: CompanySearchRequest): Promise<PaginationResponse<CompanyResponse>> {
        const search = await this.companyRepository.findRequest(request);
        const total = await this.companyRepository.countRequest(request);
        return new PaginationResponse(search.companies, new PageInfo(total));
    }
    async getDetails(CompanyId: number): Promise<CompanyDetailsResponse> {
        return await this.companyRepository.findOne(CompanyId);
    }
    async changeStatus(CompanyId: number, status: $Enums.AccountStatus): Promise<void> {
        await this.companyRepository.updateStatus(CompanyId, status);
    }
    async download(request: CompanyDownloadRequest, response: Response): Promise<void> {
        const companies = await this.companyRepository.findByIds(request);
        const fileReshape = companies.map((element) => {
            return {
                name: element.name,
                username: element.account.username,
                status: element.account.status,
                address: element.address,
                businessRegNumber: element.businessRegNumber,
                corporateRegNumber: element.corporateRegNumber,
                type: element.type,
                email: element.email,
                phone: element.phone,
                presentativeName: element.presentativeName,
                contactName: element.contactName,
                contactPhone: element.contactPhone,
            };
        });
        const excelStream = await this.excelService.createExcelFile(fileReshape, 'Company');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=CompanyList.xlsx');
        excelStream.pipe(response);
    }
}
