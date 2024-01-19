import { Body, Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { SiteAdminGetListRequest } from './request/site-admin-get-list.request';
import { SiteAdminUpdateRequest } from './request/site-admin-update.request';
import { SiteAdminGetDetailResponse } from './response/site-admin-get-detail.response';
import { SiteAdminGetListResponse } from './response/site-admin-get-list.response';
import { SiteAdminService } from './site-admin.service';

@Controller('admin/sites')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class SiteAdminController {
    constructor(private readonly siteAdminService: SiteAdminService) {}

    @Get('/download')
    async download(@Query('ids', ParseArrayPipe) query: string[], @Res() response: Response): Promise<BaseResponse<void>> {
        return BaseResponse.of(
            await this.siteAdminService.download(
                query.map((item) => Number(item)),
                response,
            ),
        );
    }

    @Patch('/:id/status')
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: SiteAdminUpdateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.siteAdminService.updateStatus(id, body));
    }
    @Get('/:id')
    async getDetails(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<SiteAdminGetDetailResponse>> {
        return BaseResponse.of(await this.siteAdminService.getDetails(id));
    }
    @Get()
    async getSites(@Query() query: SiteAdminGetListRequest): Promise<BaseResponse<SiteAdminGetListResponse>> {
        return BaseResponse.of(await this.siteAdminService.getList(query));
    }
}
