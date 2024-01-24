import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { ReportAdminService } from './report-admin.service';
import { ReportAdminUpdateRequest } from './request/report-admin-update.request';
import { BaseResponse } from 'utils/generics/base.response';
import { ReportAdminGetListRequest } from './request/report-admin-get-list.request';
import { ReportAdminGetListResponse } from './response/report-admin-get-list.response';
import { ReportAdminGetDetailResponse } from './response/report-admin-get-detail.response';

@Controller('/admin/reports')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class ReportAdminController {
    constructor(private readonly reportAdminService: ReportAdminService) {}

    @Patch('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: ReportAdminUpdateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.reportAdminService.update(id, body));
    }

    @Get()
    async getList(@Query() query: ReportAdminGetListRequest): Promise<BaseResponse<ReportAdminGetListResponse>> {
        return BaseResponse.of(await this.reportAdminService.getList(query));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<ReportAdminGetDetailResponse>> {
        return BaseResponse.of(await this.reportAdminService.getDetail(id));
    }

    @Delete()
    async delete(
        @Query('reportIdList', new ParseArrayPipe({ items: Number, separator: ',' })) reportIdList: number[],
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.reportAdminService.delete(reportIdList));
    }
}
