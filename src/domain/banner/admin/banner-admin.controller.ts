import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import {
    AdminBannerGetAdminJobPostResponse,
    AdminJobPostBannerResponse,
} from './response/banner-admin-get-admin-jobpost.response';
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
    @Post('/general/create')
    @ApiOperation({
        summary: 'General Banner create',
        description: 'This endpoint create general banner',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'General Banner create successfully', type: BaseResponse })
    async createGeneralBanner(@Body() body: AdminBannerCreateGeneralRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.createGeneralBanner(body));
    }

    @Get('/general')
    @ApiOperation({
        summary: 'General Banner get',
        description: 'This endpoint get general banners',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'General Banner get successfully', type: AdminBannerGetGeneralResponse })
    async getGeneralBanner(@Query() query: AdminBannerGetGeneralRequest): Promise<BaseResponse<AdminBannerGetGeneralResponse>> {
        return BaseResponse.of(await this.adminBannerService.getGeneralBanner(query));
    }

    @Get('/general/:id')
    @ApiOperation({
        summary: 'General Banner Detail get',
        description: 'This endpoint get detail of general banners',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'General Banner Detail get successfully',
        type: AdminBannerGetGeneralResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Banner not found',
        type: BaseResponse,
    })
    async getDetailGeneralBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<AdminBannerGetDetailGeneralResponse>> {
        return BaseResponse.of(await this.adminBannerService.getDetailGeneralBanner(id));
    }

    // ADMIN POST BANNER
    @Post('/post/create')
    @ApiOperation({
        summary: 'Post Banner create',
        description: 'This endpoint create post banner',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Post Banner create successfully',
        type: BaseResponse,
    })
    async createAdminPostBanner(@Body() body: AdminBannerCreateJobPostRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.createAdminPostBanner(body));
    }
    @Get('/adminpost')
    @ApiOperation({
        summary: 'Admin Job Post Banner get',
        description: 'This endpoint get admin job post banners',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admin Job Post Banner get successfully',
        type: AdminJobPostBannerResponse,
    })
    async getAdminPostBanner(
        @Query() query: AdminBannerGetAdminJobPostRequest,
    ): Promise<BaseResponse<AdminBannerGetAdminJobPostResponse>> {
        return BaseResponse.of(await this.adminBannerService.getAdminPostBanner(query));
    }

    @Get('/adminpost/:id')
    @ApiOperation({
        summary: 'Admin Post Banner Detail get',
        description: 'This endpoint get detail of admin job post banners',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Admin Post Banner Detail get successfully',
        type: AdminBannerGetGeneralResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Banner not found',
        type: BaseResponse,
    })
    async getDetailAdminPostBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<AdminBannerGetDetailAdminJobPostResponse>> {
        return BaseResponse.of(await this.adminBannerService.getDetailAdminPostBanner(id));
    }
    // COMPANY POST BANNER
    @Get('/companypost')
    @ApiOperation({
        summary: 'Company Job Post Banner get',
        description: 'This endpoint get company job post banners',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Company Job Post Banner get successfully',
        type: AdminBannerGetCompanyJobPostResponse,
    })
    async getCompanyPostBanner(
        @Query() query: AdminBannerGetCompanyJobPostRequest,
    ): Promise<BaseResponse<AdminBannerGetCompanyJobPostResponse>> {
        return BaseResponse.of(await this.adminBannerService.getCompanyPostBanner(query));
    }

    @Patch('/companypost/:id/status')
    @ApiOperation({
        summary: 'Change status Company Job Post Banner',
        description: 'This endpoint change status company job post banners',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Company Job Post Banner status change successfully',
        type: BaseResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Banner not found',
        type: BaseResponse,
    })
    async changeCompanyStatusBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AdminBannerChangeStatusCompanyBannerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.changeCompanyStatusBanner(true, id, body));
    }
    @Get('/companypost/:id')
    @ApiOperation({
        summary: 'Company Post Banner Detail get',
        description: 'This endpoint get detail of company job post banners',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Company Post Banner Detail get successfully',
        type: AdminBannerGetGeneralResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Banner not found',
        type: BaseResponse,
    })
    async getDetailCopmpanyPostBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<AdminBannerGetDetailCompanyJobPostResponse>> {
        return BaseResponse.of(await this.adminBannerService.getDetailCompanyPostBanner(id));
    }
    // SITE POST BANNER
    @Get('/site')
    @ApiOperation({
        summary: 'Site Banner get',
        description: 'This endpoint get site banners',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Site Banner get successfully', type: AdminBannerGetSiteResponse })
    async getSiteBanner(@Query() query: AdminBannerGetSiteRequest): Promise<BaseResponse<AdminBannerGetSiteResponse>> {
        return BaseResponse.of(await this.adminBannerService.getSiteBanner(query));
    }

    @Patch('/site/:id/status')
    @ApiOperation({
        summary: 'Change status Site Banner',
        description: 'This endpoint change status site banners',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Site Banner status change successfully',
        type: BaseResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Banner not found',
        type: BaseResponse,
    })
    async changeSiteStatusBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AdminBannerChangeStatusCompanyBannerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.changeCompanyStatusBanner(false, id, body));
    }
    @Get('/site/:id')
    @ApiOperation({
        summary: 'Site Banner Detail get',
        description: 'This endpoint get detail of site banners',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Site Banner Detail get successfully',
        type: AdminBannerGetGeneralResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Banner not found',
        type: BaseResponse,
    })
    async getDetailSiteBanner(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<AdminBannerGetDetailSiteResponse>> {
        return BaseResponse.of(await this.adminBannerService.getDetailSiteBanner(id));
    }
    // COMMON ACTION
    @Delete('/:id')
    @ApiOperation({
        summary: 'Banner delete',
        description: 'This endpoint delete banners',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Banner delete successfully', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Banner not found', type: BaseResponse })
    async deleteBanner(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.deleteBanner(id));
    }
}
