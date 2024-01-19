import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { BannerAdminService } from './banner-admin.service';
import { BannerAdminChangeStatusRequestBannerRequest } from './request/banner-admin-change-status-request-banner.request';
import { BannerAdminGetListAdvertisingRequestRequest } from './request/banner-admin-get-list-advertising-request.request';
import { BannerAdminGetListAdvertisingRequest } from './request/banner-admin-get-list-advertising.request';
import { BannerAdminGetListPostRequestRequest } from './request/banner-admin-get-list-post-request.request';
import { BannerAdminGetListPostRequest } from './request/banner-admin-get-list-post.request';
import { BannerAdminUpdatePriority } from './request/banner-admin-update-priority.request';
import { BannerAdminUpsertAdvertisingRequest } from './request/banner-admin-upsert-advertising.request';
import { BannerAdminUpsertPostRequest } from './request/banner-admin-upsert-post.request';
import { BannerAdminGetDetailAdvertisingRequestResponse } from './response/banner-admin-get-detail-advertising-request.response';
import { BannerAdminGetDetailAdvertisingResponse } from './response/banner-admin-get-detail-advertising.response';
import { BannerAdminGetDetailPostRequestResponse } from './response/banner-admin-get-detail-post-request.response';
import { BannerAdminGetDetailPostResponse } from './response/banner-admin-get-detail-post.response';
import { BannerAdminGetListAdvertisingRequestResponse } from './response/banner-admin-get-list-advertising-request.response';
import { BannerAdminGetListAdvertisingResponse } from './response/banner-admin-get-list-advertising.response';
import { BannerAdminGetListPostRequestResponse } from './response/banner-admin-get-list-post-request.response';
import { BannerAdminGetListPostResponse } from './response/banner-admin-get-list-post.response';

@Controller('/admin/banners')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class BannerAdminController {
    constructor(private readonly bannerAdminService: BannerAdminService) {}
    @Post('/advertising')
    async createAdvertising(@Body() body: BannerAdminUpsertAdvertisingRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.createAdvertising(body));
    }

    @Get('/advertising')
    async getListAdvertising(
        @Query() query: BannerAdminGetListAdvertisingRequest,
    ): Promise<BaseResponse<BannerAdminGetListAdvertisingResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getListAdvertising(query));
    }

    @Get('/advertising/request')
    async getListAdvertisingRequest(
        @Query() query: BannerAdminGetListAdvertisingRequestRequest,
    ): Promise<BaseResponse<BannerAdminGetListAdvertisingRequestResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getListAdvertisingRequest(query));
    }

    @Patch('/advertising/priority')
    async updateAdvertisingPriority(@Body() body: BannerAdminUpdatePriority): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateAdvertisingPriority(body));
    }

    @Get('/advertising/:id')
    async getDetailAdvertising(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerAdminGetDetailAdvertisingResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailAdvertising(id));
    }

    @Put('/advertising/:id')
    async updateAdvertising(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminUpsertAdvertisingRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updateAdvertising(id, body));
    }

    @Get('/advertising/request/:id')
    async getDetailAdvertisingRequest(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerAdminGetDetailAdvertisingRequestResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailAdvertisingRequest(id));
    }

    @Patch('/advertising/request/:id/status')
    async changeAdvertisingRequestStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminChangeStatusRequestBannerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.changeRequestStatus(true, id, body));
    }

    @Post('/post')
    async createPost(@Body() body: BannerAdminUpsertPostRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.createPost(body));
    }

    @Get('/post')
    async getListPost(@Query() query: BannerAdminGetListPostRequest): Promise<BaseResponse<BannerAdminGetListPostResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getListPost(query));
    }

    @Get('/post/request')
    async getListPostRequest(
        @Query() query: BannerAdminGetListPostRequestRequest,
    ): Promise<BaseResponse<BannerAdminGetListPostRequestResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getListPostRequest(query));
    }

    @Patch('/post/priority')
    async updatePostPriority(@Body() body: BannerAdminUpdatePriority): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updatePostPriority(body));
    }

    @Get('/post/:id')
    async getDetailPost(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<BannerAdminGetDetailPostResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailPost(id));
    }

    @Put('/post/:id')
    async updatePost(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminUpsertPostRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.updatePost(id, body));
    }

    @Get('/post/request/:id')
    async getDetailPostRequest(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<BannerAdminGetDetailPostRequestResponse>> {
        return BaseResponse.of(await this.bannerAdminService.getDetailPostRequest(id));
    }

    @Patch('/post/request/:id/status')
    async changePostRequestStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BannerAdminChangeStatusRequestBannerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.changeRequestStatus(false, id, body));
    }

    @Delete('/:id')
    async deleteBanner(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.bannerAdminService.deleteBanner(id));
    }
}
