import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { BannerAdminService } from './banner-admin.service';
import { BannerAdminChangeStatusCompanyBannerRequest } from './request/banner-admin-change-status-company-banner.request';
import { BannerAdminGetListAdminAdvertisingRequest } from './request/banner-admin-get-list-admin-advertising.request';
import { BannerAdminGetListAdminJobPostRequest } from './request/banner-admin-get-list-admin-jobpost.request';
import { BannerAdminGetListCompanyJobPostRequest } from './request/banner-admin-get-list-company-jobpost.request';
import { BannerAdminUpdatePriority } from './request/banner-admin-update-priority.request';
import { BannerAdminUpsertAdminAdvertisingRequest } from './request/banner-admin-upsert-admin-advertising.request';
import { BannerAdminUpsertAdminJobPostRequest } from './request/banner-admin-upsert-admin-jobpost.request';
import { BannerAdminGetDetailAdminAdvertisingResponse } from './response/banner-admin-get-detail-admin-advertising.response';
import { BannerAdminGetDetailAdminJobPostResponse } from './response/banner-admin-get-detail-admin-jobpost.response';
import { BannerAdminGetDetailCompanyJobPostResponse } from './response/banner-admin-get-detail-company-jobpost.response';
import { BannerAdminGetListAdminAdvertisingResponse } from './response/banner-admin-get-list-admin-advertising.response';
import { BannerAdminGetListAdminJobPostResponse } from './response/banner-admin-get-list-admin-jobpost.response';
import { BannerAdminGetListCompanyJobPostResponse } from './response/banner-admin-get-list-company-jobpost.response';
import { BannerAdminGetListCompanyAdvertisingRequest } from './request/banner-admin-get-list-company-advertising.request';
import { BannerAdminGetListCompanyAdvertisingResponse } from './response/banner-admin-get-list-company-advertising.response';
import { BannerAdminGetDetailCompanyAdvertisingResponse } from './response/banner-admin-get-detail-company-advertising.response';

@Controller('/admin/banners')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class BannerAdminController {
    constructor(private readonly bannerAdminService: BannerAdminService) {}
    // ADMIN ADVERTISING BANNER
    @Post('/adminadvertising')
    async createAdminAdvertisingBanner(@Body() body: BannerAdminUpsertAdminAdvertisingRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.createAdminAdvertisingBanner(body));
    }

    @Get('/adminadvertising')
    async getAdminAdvertisingBanner(
        @Query() query: BannerAdminGetListAdminAdvertisingRequest,
    ): Promise<BaseResponse<BannerAdminGetListAdminAdvertisingResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getAdminAdvertisingBanner(query));
    }

    @Get('/adminadvertising/:id')
    async getDetailAdminAdvertisingBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerAdminGetDetailAdminAdvertisingResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailAdminAdvertisingBanner(id));
    }

    @Put('/adminadvertising/:id')
    async updateAdminAdvertisingBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminUpsertAdminAdvertisingRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateAdminAdvertisingBanner(id, body));
    }

    @Patch('/adminadvertising/priority')
    async updateAdminAdvertisingPriority(@Body() body: BannerAdminUpdatePriority): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateAdminAdvertisingBannerPriority(body));
    }

    // ADMIN POST BANNER
    @Post('/adminpost')
    async createAdminPostBanner(@Body() body: BannerAdminUpsertAdminJobPostRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.createAdminPostBanner(body));
    }

    @Get('/adminpost')
    async getAdminPostBanner(
        @Query() query: BannerAdminGetListAdminJobPostRequest,
    ): Promise<BaseResponse<BannerAdminGetListAdminJobPostResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getAdminPostBanner(query));
    }

    @Get('/adminpost/:id')
    async getDetailAdminPostBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerAdminGetDetailAdminJobPostResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailAdminPostBanner(id));
    }

    @Put('/adminpost/:id')
    async updateAdminPostBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminUpsertAdminJobPostRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateAdminPostBanner(id, body));
    }

    @Patch('/adminpost/priority')
    async updateAdminPostPriority(@Body() body: BannerAdminUpdatePriority): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateAdminPostBannerPriority(body));
    }

    // COMPANY POST BANNER
    @Get('/companypost')
    async getCompanyPostBanner(
        @Query() query: BannerAdminGetListCompanyJobPostRequest,
    ): Promise<BaseResponse<BannerAdminGetListCompanyJobPostResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getCompanyPostBanner(query));
    }

    @Patch('/companypost/:id/status')
    async changeCompanyStatusBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminChangeStatusCompanyBannerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.changeCompanyStatusBanner(true, id, body));
    }

    @Get('/companypost/:id')
    async getDetailCopmpanyPostBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerAdminGetDetailCompanyJobPostResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailCompanyPostBanner(id));
    }

    @Patch('/companypost/priority')
    async updateCompanyPostPriority(@Body() body: BannerAdminUpdatePriority): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateCompanyPostBannerPriority(body));
    }

    // COMPANY ADVERTISING
    @Get('/companyadvertising')
    async getCompanyAdvertisingBanner(
        @Query() query: BannerAdminGetListCompanyAdvertisingRequest,
    ): Promise<BaseResponse<BannerAdminGetListCompanyAdvertisingResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getCompanyAdvertisingBanner(query));
    }
    @Patch('/companyadvertising/:id/status')
    async changeSiteStatusBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminChangeStatusCompanyBannerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.changeCompanyStatusBanner(false, id, body));
    }

    @Get('/companyadvertising/:id')
    async getDetailCompanyAdvertisingBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerAdminGetDetailCompanyAdvertisingResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailCompanyAdvertisingBanner(id));
    }

    @Patch('/companyadvertising/priority')
    async updateCompanyAdvertisingriority(@Body() body: BannerAdminUpdatePriority): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateCompanyAdvertisingBannerPriority(body));
    }

    // COMMON ACTION
    @Delete('/:id')
    async deleteBanner(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.deleteBanner(id));
    }
}
