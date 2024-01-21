import { Controller, Get, Param, ParseIntPipe, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { LaborAdminService } from './labor-admin.service';
import { LaborAdminGetListHistoryRequest } from './request/labor-admin-get-list-history.request';
import { LaborAdminGetListHistoryResponse } from './response/labor-admin-get-list-history.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('/admin/labors')
export class LaborAdminController {
    constructor(private readonly laborAdminService: LaborAdminService) {}

    @Get('/site/:siteId/history')
    async getListHistory(
        @Param('siteId', ParseIntPipe) id: number,
        @Query() query: LaborAdminGetListHistoryRequest,
    ): Promise<BaseResponse<LaborAdminGetListHistoryResponse>> {
        const history = await this.laborAdminService.getListHistory(id, query);
        return BaseResponse.of(history);
    }

    @Get('/site/:siteId/history/download')
    async downloadHistory(
        @Res() response: Response,
        @Param('siteId', ParseIntPipe) id: number,
        @Query() query: LaborAdminGetListHistoryRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.laborAdminService.downloadHistory(id, query, response));
    }
}
