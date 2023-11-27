import { Inject, Injectable } from '@nestjs/common';
import { CompanyDTO } from 'application/dtos/company.dto';
import { CompanyRepository } from 'domain/repositories/company.repository';
import { CompanyUseCase } from 'application/use-cases/company.use-case';
import { CompanySearchRequest, CompanyDownloadRequest } from 'presentation/requests/admin-company.request';
import { $Enums } from '@prisma/client';
import { Response } from 'express'
import { ExcelService } from 'infrastructure/services/excel.service';
@Injectable()
export class CompanyUseCaseImpl implements CompanyUseCase {
  constructor(
    @Inject(CompanyRepository) private readonly companyRepository: CompanyRepository,
    @Inject(ExcelService) private readonly excelService: ExcelService
  ) {}
  async getCompanies(request: CompanySearchRequest): Promise<CompanyDTO[]> {
    const companies = await this.companyRepository.findRequest(request);
    return companies.map(company => CompanyDTO.from(company));
  }
  async getDetails(CompanyId: number): Promise<CompanyDTO> {
    return await this.companyRepository.findOne(CompanyId);
  }
  async changeStatus(CompanyId: number, status: $Enums.AccountStatus): Promise<void> {
    await this.companyRepository.updateStatus(CompanyId, status);
  }
  async download(request: CompanyDownloadRequest, response: Response): Promise<void>{
    const companies = await this.companyRepository.findByIds(request)
    const excelStream = await this.excelService.createExcelFile(companies,'Company')
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename=CompanyList.xlsx');
    excelStream.pipe(response);
  }
}
