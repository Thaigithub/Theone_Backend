import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { AdminBannerService } from './banner-admin.service';
import { AdminBannerCreateJobPostRequest } from './request/banner-admin-create-admin-jobpost.request';
import { AdminBannerCreateGeneralRequest } from './request/banner-admin-create-general.request';
import { AdminBannerGetAdminJobPostRequest } from './request/banner-admin-get-admin-jobpost.request';
import { AdminBannerGetCompanyJobPostRequest } from './request/banner-admin-get-company-jobpost.request';
import { AdminBannerGetGeneralRequest } from './request/banner-admin-get-general.request';
import { AdminBannerGetSiteRequest } from './request/banner-admin-get-site.request';
import { AdminBannerGetAdminJobPostResponse } from './response/banner-admin-get-admin-jobpost.response';
import { AdminBannerGetCompanyJobPostResponse } from './response/banner-admin-get-company-jobpost.response';
import { AdminBannerGetGeneralResponse } from './response/banner-admin-get-general.response';
import { AdminBannerGetSiteResponse } from './response/banner-admin-get-site.response';

@ApiTags('[ADMIN] Banner Management')
@Controller('/admin/banners')
@ApiProduces('application/json')
@ApiConsumes('application/json')
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
    @ApiResponse({ status: HttpStatus.OK, description: 'General Banner get successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Fail to get general banner' })
    async getGeneralBanner(@Query() query: AdminBannerGetGeneralRequest): Promise<BaseResponse<AdminBannerGetGeneralResponse>> {
        return BaseResponse.of(await this.adminBannerService.getGeneralBanner(query));
    }

    // ADMIN POST BANNER
    @Post('/post/create')
    @ApiOperation({
        summary: 'Post Banner create',
        description: 'This endpoint create post banner',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Post Banner create successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Fail to create post banner' })
    async createAdminPostBanner(@Body() body: AdminBannerCreateJobPostRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminBannerService.createAdminPostBanner(body));
    }
    @Get('/adminpost')
    @ApiOperation({
        summary: 'Admin Job Post Banner get',
        description: 'This endpoint get admin job post banners',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Admin Job Post Banner get successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Fail to get admin job post banner' })
    async getAdminPostBanner(
        @Query() query: AdminBannerGetAdminJobPostRequest,
    ): Promise<BaseResponse<AdminBannerGetAdminJobPostResponse>> {
        return BaseResponse.of(await this.adminBannerService.getAdminPostBanner(query));
    }
    // COMPANY POST BANNER
    @Get('/companypost')
    @ApiOperation({
        summary: 'Company Job Post Banner get',
        description: 'This endpoint get company job post banners',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Company Job Post Banner get successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Fail to get company job post banner' })
    async getCompanyPostBanner(
        @Query() query: AdminBannerGetCompanyJobPostRequest,
    ): Promise<BaseResponse<AdminBannerGetCompanyJobPostResponse>> {
        return BaseResponse.of(await this.adminBannerService.getCompanyPostBanner(query));
    }

    // SITE POST BANNER
    @Get('/site')
    @ApiOperation({
        summary: 'Site Banner get',
        description: 'This endpoint get site banners',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Site Banner get successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Fail to get site banner' })
    async getSiteBanner(@Query() query: AdminBannerGetSiteRequest): Promise<BaseResponse<AdminBannerGetSiteResponse>> {
        return BaseResponse.of(await this.adminBannerService.getSiteBanner(query));
    }
}
