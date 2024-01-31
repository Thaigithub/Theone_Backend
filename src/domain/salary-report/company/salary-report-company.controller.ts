import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { SalaryReportCompanyCreateRequest } from './request/salary-report-company-create.request';
import { SalaryReportCompanyGetListRequest } from './request/salary-report-company-get-list.request';
import { SalaryReportCompanyGetListResponse } from './response/salary-report-company-get-list.response';
import { SalaryReportCompanyService } from './salary-report-company.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('/company/salary-reports')
export class SalaryReportCompanyController {
    constructor(private salaryReportCompanyService: SalaryReportCompanyService) {}

    @Post()
    async requestSalaryReport(
        @Req() request: BaseRequest,
        @Body() body: SalaryReportCompanyCreateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.salaryReportCompanyService.requestSalaryReport(request.user.accountId, body));
    }

    @Get()
    async getList(
        @Req() request: BaseRequest,
        @Query() query: SalaryReportCompanyGetListRequest,
    ): Promise<BaseResponse<SalaryReportCompanyGetListResponse>> {
        return BaseResponse.of(await this.salaryReportCompanyService.getList(request.user.accountId, query));
    }
}
