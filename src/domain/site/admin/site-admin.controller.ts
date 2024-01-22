import { Body, Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { SiteAdminGetListLaborRequest } from './request/site-admin-get-list-labor.request';
import { SiteAdminGetListRequest } from './request/site-admin-get-list.request';
import { SiteAdminUpdateRequest } from './request/site-admin-update-status.request';
import { SiteAdminGetDetailContractResponse } from './response/site-admin-get-detail-contract.response';
import { SiteAdminGetDetailLaborResponse } from './response/site-admin-get-detail-labor.response';
import { SiteAdminGetDetailResponse } from './response/site-admin-get-detail.response';
import { SiteAdminGetListLaborResponse } from './response/site-admin-get-list-labor.response';
import { SiteAdminGetListResponse } from './response/site-admin-get-list.response';
import { SiteAdminService } from './site-admin.service';

@Controller('/admin/sites')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class SiteAdminController {
    constructor(private readonly siteAdminService: SiteAdminService) {}

    @Get('/:id/labor')
    async getDetailLabor(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<SiteAdminGetDetailLaborResponse>> {
        return BaseResponse.of(await this.siteAdminService.getDetailLabor(id));
    }

    @Patch('/:id/status')
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: SiteAdminUpdateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.siteAdminService.updateStatus(id, body));
    }

    @Get('/:id/contract')
    async getDetailContract(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<SiteAdminGetDetailContractResponse>> {
        return BaseResponse.of(await this.siteAdminService.getDetailContract(id));
    }

    @Get('/download')
    async download(@Query('ids', ParseArrayPipe) query: string[], @Res() response: Response): Promise<BaseResponse<void>> {
        return BaseResponse.of(
            await this.siteAdminService.download(
                query.map((item) => Number(item)),
                response,
            ),
        );
    }

    @Get('/labor')
    async getListLabor(@Query() query: SiteAdminGetListLaborRequest): Promise<BaseResponse<SiteAdminGetListLaborResponse>> {
        return BaseResponse.of(await this.siteAdminService.getListLabor(query));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<SiteAdminGetDetailResponse>> {
        return BaseResponse.of(await this.siteAdminService.getDetail(id));
    }

    @Get()
    async getList(@Query() query: SiteAdminGetListRequest): Promise<BaseResponse<SiteAdminGetListResponse>> {
        return BaseResponse.of(await this.siteAdminService.getList(query));
    }
}
