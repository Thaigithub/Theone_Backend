import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { BannerCompanyService } from './banner-company.service';
import { BannerCompanyGetListRequestRequest } from './request/banner-company-get-list-request.request';
import { BannerCompanyUpsertRequestRequest } from './request/banner-company-upsert.request';
import { BannerCompanyGetDetailRequestResponse } from './response/banner-company-get-detail-request.response';
import { BannerCompanyGetListRequestResponse } from './response/banner-company-get-list-request.response';

@Controller('/company/banners')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
export class BannerCompanyController {
    constructor(private bannerCompanyService: BannerCompanyService) {}
    @Get('/request')
    async getList(
        @Query() query: BannerCompanyGetListRequestRequest,
        @Req() req: AccountIdExtensionRequest,
    ): Promise<BaseResponse<BannerCompanyGetListRequestResponse>> {
        return BaseResponse.of(await this.bannerCompanyService.getList(req.user.accountId, query));
    }

    @Post('/request')
    async create(
        @Req() req: AccountIdExtensionRequest,
        @Body() body: BannerCompanyUpsertRequestRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerCompanyService.create(req.user.accountId, body));
    }

    @Get('/request/:id')
    async getDetail(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerCompanyGetDetailRequestResponse>> {
        return BaseResponse.of(await this.bannerCompanyService.getDetail(req.user.accountId, id));
    }

    @Delete('/request/:id')
    async delete(@Req() req: AccountIdExtensionRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerCompanyService.delete(req.user.accountId, id));
    }
}
