import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { BannerCompanyService } from './banner-company.service';
import { BannerCompanyGetListRequest } from './request/banner-company-get-list.request';
import { BannerCompanyUpsertRequest } from './request/banner-company-upsert.request';
import { BannerCompanyGetDetailResponse } from './response/banner-company-get-detail.response';
import { BannerCompanyGetListResponse } from './response/banner-company-get-list.response';

@Controller('/company/banners')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class BannerCompanyController {
    constructor(private bannerCompanyService: BannerCompanyService) {}
    @Get()
    async getList(
        @Query() query: BannerCompanyGetListRequest,
        @Req() req: AccountIdExtensionRequest,
    ): Promise<BaseResponse<BannerCompanyGetListResponse>> {
        return BaseResponse.of(await this.bannerCompanyService.getList(req.user.accountId, query));
    }

    @Post()
    async create(@Req() req: AccountIdExtensionRequest, @Body() body: BannerCompanyUpsertRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerCompanyService.create(req.user.accountId, body));
    }

    @Get('/:id')
    async getDetail(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.bannerCompanyService.getDetail(req.user.accountId, id));
    }
}
