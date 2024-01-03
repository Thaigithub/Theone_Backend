import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { AdminBannerService } from './banner-admin.service';
import { AdminBannerChangeStatusCompanyBannerRequest } from './request/banner-admin-change-status-company-banner.request';
import { AdminBannerCreateJobPostRequest } from './request/banner-admin-create-admin-jobpost.request';
import { AdminBannerCreateGeneralRequest } from './request/banner-admin-create-general.request';
import { AdminBannerGetAdminJobPostRequest } from './request/banner-admin-get-admin-jobpost.request';
import { AdminBannerGetCompanyJobPostRequest } from './request/banner-admin-get-company-jobpost.request';
import { AdminBannerGetGeneralRequest } from './request/banner-admin-get-general.request';
import { AdminBannerGetSiteRequest } from './request/banner-admin-get-site.request';
import { AdminBannerGetDetailAdminJobPostResponse } from './response/banner-admin-get-admin-jobpost-detail.response';
import { AdminBannerGetAdminJobPostResponse } from './response/banner-admin-get-admin-jobpost.response';
import { AdminBannerGetDetailCompanyJobPostResponse } from './response/banner-admin-get-company-jobpost-detail.response';
import { AdminBannerGetCompanyJobPostResponse } from './response/banner-admin-get-company-jobpost.response';
import { AdminBannerGetDetailGeneralResponse } from './response/banner-admin-get-general-detail.response';
import { AdminBannerGetGeneralResponse } from './response/banner-admin-get-general.response';
import { AdminBannerGetDetailSiteResponse } from './response/banner-admin-get-site-detail.response';
import { AdminBannerGetSiteResponse } from './response/banner-admin-get-site.response';

@ApiTags('[ADMIN] Banner Management')
@Controller('/admin/banners')
@ApiProduces('application/json')
@ApiConsumes('application/json')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@Roles(AccountType.ADMIN)
export class AdminBannerController {
    constructor(private readonly adminBannerService: AdminBannerService) {}
    // GENERAL BANNER
    @Post('/general')
    async createGeneralBanner(@Body() body: AdminBannerCreateGeneralRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.createGeneralBanner(body));
    }
    @Get('/general')
    async getGeneralBanner(@Query() query: AdminBannerGetGeneralRequest): Promise<BaseResponse<AdminBannerGetGeneralResponse>> {
        return BaseResponse.of(await this.adminBannerService.getGeneralBanner(query));
    }
    @Get('/general/:id')
    async getDetailGeneralBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<AdminBannerGetDetailGeneralResponse>> {
        return BaseResponse.of(await this.adminBannerService.getDetailGeneralBanner(id));
    }

    // ADMIN POST BANNER
    @Post('/adminpost')
    async createAdminPostBanner(@Body() body: AdminBannerCreateJobPostRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.createAdminPostBanner(body));
    }
    @Get('/adminpost')
    async getAdminPostBanner(
        @Query() query: AdminBannerGetAdminJobPostRequest,
    ): Promise<BaseResponse<AdminBannerGetAdminJobPostResponse>> {
        return BaseResponse.of(await this.adminBannerService.getAdminPostBanner(query));
    }
    @Get('/adminpost/:id')
    async getDetailAdminPostBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<AdminBannerGetDetailAdminJobPostResponse>> {
        return BaseResponse.of(await this.adminBannerService.getDetailAdminPostBanner(id));
    }
    // COMPANY POST BANNER
    @Get('/companypost')
    async getCompanyPostBanner(
        @Query() query: AdminBannerGetCompanyJobPostRequest,
    ): Promise<BaseResponse<AdminBannerGetCompanyJobPostResponse>> {
        return BaseResponse.of(await this.adminBannerService.getCompanyPostBanner(query));
    }

    @Patch('/companypost/:id/status')
    async changeCompanyStatusBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AdminBannerChangeStatusCompanyBannerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.changeCompanyStatusBanner(true, id, body));
    }
    @Get('/companypost/:id')
    async getDetailCopmpanyPostBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<AdminBannerGetDetailCompanyJobPostResponse>> {
        return BaseResponse.of(await this.adminBannerService.getDetailCompanyPostBanner(id));
    }
    // SITE POST BANNER
    @Get('/site')
    async getSiteBanner(@Query() query: AdminBannerGetSiteRequest): Promise<BaseResponse<AdminBannerGetSiteResponse>> {
        return BaseResponse.of(await this.adminBannerService.getSiteBanner(query));
    }

    @Patch('/site/:id/status')
    async changeSiteStatusBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AdminBannerChangeStatusCompanyBannerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.changeCompanyStatusBanner(false, id, body));
    }
    @Get('/site/:id')
    async getDetailSiteBanner(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<AdminBannerGetDetailSiteResponse>> {
        return BaseResponse.of(await this.adminBannerService.getDetailSiteBanner(id));
    }
    // COMMON ACTION
    @Delete('/:id')
    async deleteBanner(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.deleteBanner(id));
    }
}
