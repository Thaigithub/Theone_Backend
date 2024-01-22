import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { SalaryReportAdminService } from './salary-report-admin.service';
import { SalaryReportAdminGetListRequest } from './request/salary-report-admin-get-list.request';
import { BaseResponse } from 'utils/generics/base.response';
import { SalaryReportAdminGetListResponse } from './response/salary-report-admin-get-list.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('/admin/salary-reports')
export class SalaryReportAdminController {
    constructor(private readonly salaryReportAdminService: SalaryReportAdminService) {}

    @Get()
    async getList(@Query() query: SalaryReportAdminGetListRequest): Promise<BaseResponse<SalaryReportAdminGetListResponse>> {
        return BaseResponse.of(await this.salaryReportAdminService.getList(query));
    }
}
