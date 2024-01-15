import { Controller, Get, Param, ParseIntPipe, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { WorkAdminGetDetailListHistoryRequest } from './request/work-admin-get-detail-list-history.request';
import { WorkAdminGetListRequest } from './request/work-admin-get-list.request';
import { WorkAdminGetDetailListHistoryResponse } from './response/work-admin-get-detail-list-history.response';
import { WorkAdminGetDetailSiteResponse } from './response/work-admin-get-detail-site.response';
import { WorkAdminGetListResponse } from './response/work-admin-get-list.response';
import { WorkAdminService } from './work-admin.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('admin/work')
export class WorkAdminController {
    constructor(private readonly workAdminService: WorkAdminService) {}

    @Get()
    async getList(@Query() query: WorkAdminGetListRequest): Promise<BaseResponse<WorkAdminGetListResponse>> {
        const code = await this.workAdminService.getList(query);
        return BaseResponse.of(code);
    }

    @Get(':id/site')
    async getDetailSite(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<WorkAdminGetDetailSiteResponse>> {
        const code = await this.workAdminService.getDetailSite(id);
        return BaseResponse.of(code);
    }

    @Get(':siteId/work-history')
    async getDetailHistory(
        @Param('siteId', ParseIntPipe) id: number,
        @Query() query: WorkAdminGetDetailListHistoryRequest,
    ): Promise<BaseResponse<WorkAdminGetDetailListHistoryResponse>> {
        const history = await this.workAdminService.getDetailHistory(id, query);
        return BaseResponse.of(history);
    }

    @Get(':siteId/download-work-history')
    async downloadDetailHistory(
        @Res() response: Response,
        @Param('siteId', ParseIntPipe) id: number,
        @Query() query: WorkAdminGetDetailListHistoryRequest,
    ): Promise<BaseResponse<void>> {
        const history = await this.workAdminService.downloadDetailHistory(id, query, response);
        return BaseResponse.of(history);
    }
}
