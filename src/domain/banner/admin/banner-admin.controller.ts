import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { BannerAdminService } from './banner-admin.service';
import { BannerAdminChangeStatusCompanyBannerRequest } from './request/banner-admin-change-status-company-banner.request';
import { BannerAdminGetAdminJobPostRequest } from './request/banner-admin-get-admin-jobpost.request';
import { BannerAdminGetCompanyJobPostRequest } from './request/banner-admin-get-company-jobpost.request';
import { BannerAdminGetGeneralRequest } from './request/banner-admin-get-general.request';
import { BannerAdminGetSiteRequest } from './request/banner-admin-get-site.request';
import { BannerAdminUpdatePriority } from './request/banner-admin-update-priority.request';
import { BannerAdminUpsertJobPostRequest } from './request/banner-admin-upsert-admin-jobpost.request';
import { BannerAdminUpsertGeneralRequest } from './request/banner-admin-upsert-general.request';
import { BannerAdminGetDetailAdminJobPostResponse } from './response/banner-admin-get-admin-jobpost-detail.response';
import { BannerAdminGetAdminJobPostResponse } from './response/banner-admin-get-admin-jobpost.response';
import { BannerAdminGetDetailCompanyJobPostResponse } from './response/banner-admin-get-company-jobpost-detail.response';
import { BannerAdminGetCompanyJobPostResponse } from './response/banner-admin-get-company-jobpost.response';
import { BannerAdminGetDetailGeneralResponse } from './response/banner-admin-get-general-detail.response';
import { BannerAdminGetGeneralResponse } from './response/banner-admin-get-general.response';
import { BannerAdminGetDetailSiteResponse } from './response/banner-admin-get-site-detail.response';
import { BannerAdminGetSiteResponse } from './response/banner-admin-get-site.response';

@Controller('/admin/banners')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class BannerAdminController {
    constructor(private readonly bannerAdminService: BannerAdminService) {}
    // GENERAL BANNER
    @Post('/general')
    async createGeneralBanner(@Body() body: BannerAdminUpsertGeneralRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.createGeneralBanner(body));
    }

    @Get('/general')
    async getGeneralBanner(@Query() query: BannerAdminGetGeneralRequest): Promise<BaseResponse<BannerAdminGetGeneralResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getGeneralBanner(query));
    }

    @Get('/general/:id')
    async getDetailGeneralBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerAdminGetDetailGeneralResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailGeneralBanner(id));
    }

    @Put('/general/:id')
    async updateGeneralBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminUpsertGeneralRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateGeneralBanner(id, body));
    }

    @Patch('/general/priority')
    async updateGeneralPriority(@Body() body: BannerAdminUpdatePriority): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateGeneralBannerPriority(body));
    }

    // ADMIN POST BANNER
    @Post('/adminpost')
    async createAdminPostBanner(@Body() body: BannerAdminUpsertJobPostRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.createAdminPostBanner(body));
    }

    @Get('/adminpost')
    async getAdminPostBanner(
        @Query() query: BannerAdminGetAdminJobPostRequest,
    ): Promise<BaseResponse<BannerAdminGetAdminJobPostResponse>> {
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
        @Body() body: BannerAdminUpsertJobPostRequest,
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
        @Query() query: BannerAdminGetCompanyJobPostRequest,
    ): Promise<BaseResponse<BannerAdminGetCompanyJobPostResponse>> {
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

    // SITE POST BANNER
    @Get('/site')
    async getSiteBanner(@Query() query: BannerAdminGetSiteRequest): Promise<BaseResponse<BannerAdminGetSiteResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getSiteBanner(query));
    }

    @Patch('/site/:id/status')
    async changeSiteStatusBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminChangeStatusCompanyBannerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.changeCompanyStatusBanner(false, id, body));
    }

    @Get('/site/:id')
    async getDetailSiteBanner(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<BannerAdminGetDetailSiteResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailSiteBanner(id));
    }

    @Patch('/site/priority')
    async updateSitePriority(@Body() body: BannerAdminUpdatePriority): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateSiteBannerPriority(body));
    }

    // COMMON ACTION
    @Delete('/:id')
    async deleteBanner(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.deleteBanner(id));
    }
}
