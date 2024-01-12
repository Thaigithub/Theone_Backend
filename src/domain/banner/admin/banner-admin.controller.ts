import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { BannerAdminService } from './banner-admin.service';
import { BannerAdminChangeStatusRequestBannerRequest } from './request/banner-admin-change-status-request-banner.request';
import { BannerAdminGetListAdvertisingRequestRequest } from './request/banner-admin-get-list-advertising-request.request';
import { BannerAdminGetListAdvertisingRequest } from './request/banner-admin-get-list-advertising.request';
import { BannerAdminUpdatePriority } from './request/banner-admin-update-priority.request';
import { BannerAdminUpsertAdvertisingRequest } from './request/banner-admin-upsert-advertising.request';
import { BannerAdminUpsertPostRequest } from './request/banner-admin-upsert-post.request';
import { BannerAdminGetDetailAdvertisingResponse } from './response/banner-admin-get-detail-advertising.response';
import { BannerAdminGetListAdvertisingRequestResponse } from './response/banner-admin-get-list-advertising-request.response';
import { BannerAdminGetListAdvertisingResponse } from './response/banner-admin-get-list-advertising.response';
import { BannerAdminGetDetailAdvertisingRequestResponse } from './response/banner-admin-get-detail-advertising-request.response';
import { BannerAdminGetListPostRequest } from './request/banner-admin-get-list-post.request';
import { BannerAdminGetListPostResponse } from './response/banner-admin-get-list-post.response';

@Controller('/admin/banners')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class BannerAdminController {
    constructor(private readonly bannerAdminService: BannerAdminService) {}
    @Post('/advertising')
    async createAdvertisingBanner(@Body() body: BannerAdminUpsertAdvertisingRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.createAdvertisingBanner(body));
    }

    @Get('/advertising')
    async getAdvertisingBanner(
        @Query() query: BannerAdminGetListAdvertisingRequest,
    ): Promise<BaseResponse<BannerAdminGetListAdvertisingResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getAdvertisingBanner(query));
    }

    @Get('/advertising/request')
    async getAdvertisingBannerRequest(
        @Query() query: BannerAdminGetListAdvertisingRequestRequest,
    ): Promise<BaseResponse<BannerAdminGetListAdvertisingRequestResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getAdvertisingBannerRequest(query));
    }

    @Get('/advertising/:id')
    async getDetailAdvertisingBanner(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerAdminGetDetailAdvertisingResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailAdvertisingBanner(id));
    }

    @Put('/advertising/:id')
    async updateAdvertisingBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminUpsertAdvertisingRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateAdvertisingBanner(id, body));
    }

    @Patch('/advertising/priority')
    async updateAdvertisingBannerPriority(@Body() body: BannerAdminUpdatePriority): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateAdvertisingBannerPriority(body));
    }

    @Get('/advertising/request/:id')
    async getDetailAdvertisingBannerRequest(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerAdminGetDetailAdvertisingRequestResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailAdvertisingBannerRequest(id));
    }

    @Patch('/advertising/request/:id/status')
    async changeAdvertisingStatusBannerRequest(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminChangeStatusRequestBannerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.changeStatusBannerRequest(true, id, body));
    }

    @Post('/post')
    async createPostBanner(@Body() body: BannerAdminUpsertPostRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.createPostBanner(body));
    }

    @Get('/post')
    async getPostBanner(@Query() query: BannerAdminGetListPostRequest): Promise<BaseResponse<BannerAdminGetListPostResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getPostBanner(query));
    }

    // @Patch('/post/priority')
    // async updatePostBannerPriority(@Body() body: BannerAdminUpdatePriority): Promise<BaseResponse<void>> {
    //     return BaseResponse.of(await this.bannerAdminService.updatePostBannerPriority(body));
    // }

    // @Get('/post/request')
    // async getPostBannerRequest(
    //     @Query() query: BannerAdminGetListPostRequestRequest,
    // ): Promise<BaseResponse<BannerAdminGetListPostRequestResponse>> {
    //     return BaseResponse.of(await this.bannerAdminService.getPostBannerRequest(query));
    // }

    // @Get('/post/:id')
    // async getDetailPostBanner(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<BannerAdminGetDetailPostResponse>> {
    //     return BaseResponse.of(await this.bannerAdminService.getDetailPostBanner(id));
    // }

    // @Put('/post/:id')
    // async updatePostBanner(
    //     @Param('id', ParseIntPipe) id: number,
    //     @Body() body: BannerAdminUpsertPostRequest,
    // ): Promise<BaseResponse<void>> {
    //     return BaseResponse.of(await this.bannerAdminService.updatePostBanner(id, body));
    // }

    // @Patch('/post/request/:id/status')
    // async changePostStatusBannerRequest(
    //     @Param('id', ParseIntPipe) id: number,
    //     @Body() body: BannerAdminChangeStatusRequestBannerRequest,
    // ): Promise<BaseResponse<void>> {
    //     return BaseResponse.of(await this.bannerAdminService.changeStatusBannerRequest(id, body));
    // }

    // @Get('/post/request/:id')
    // async getDetailPostBannerRequest(
    //     @Param('id', ParseIntPipe) id: number,
    // ): Promise<BaseResponse<BannerAdminGetDetailPostRequestResponse>> {
    //     return BaseResponse.of(await this.bannerAdminService.getDetailPostBannerRequest(id));
    // }

    @Delete('/:id')
    async deleteBanner(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.deleteBanner(id));
    }
}
