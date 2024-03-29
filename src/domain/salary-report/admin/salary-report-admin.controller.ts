import { Controller, Delete, Get, ParseArrayPipe, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { SalaryReportAdminGetListRequest } from './request/salary-report-admin-get-list.request';
import { SalaryReportAdminGetListResponse } from './response/salary-report-admin-get-list.response';
import { SalaryReportAdminService } from './salary-report-admin.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('/admin/salary-reports')
export class SalaryReportAdminController {
    constructor(private salaryReportAdminService: SalaryReportAdminService) {}

    @Get()
    async getList(@Query() query: SalaryReportAdminGetListRequest): Promise<BaseResponse<SalaryReportAdminGetListResponse>> {
        return BaseResponse.of(await this.salaryReportAdminService.getList(query));
    }

    @Delete()
    async delete(
        @Query('salaryReportIdList', new ParseArrayPipe({ items: Number, separator: ',' })) salaryReportIdList: number[],
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.salaryReportAdminService.delete(salaryReportIdList));
    }
}
