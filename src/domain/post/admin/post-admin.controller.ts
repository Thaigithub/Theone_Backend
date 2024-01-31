import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PostAdminService } from './post-admin.service';
import { PostAdminDeleteRequest } from './request/post-admin-delete.request';
import { PostAdminGetListForApplicationRequest } from './request/post-admin-get-list-application.request';
import { PostAdminGetListRequest } from './request/post-admin-get-list.request';
import { PostAdminUpdateExposureRequest } from './request/post-admin-update-exposure.request';
import { PostAdminUpdatePullupRequest } from './request/post-admin-update-pullup.request';
import { PostAdminUpdateTypeRequest } from './request/post-admin-update-type.request';
import { PostAdminUpdateRequest } from './request/post-admin-update.request';
import { PostAdminGetDetailResponse } from './response/post-admin-get-detail.response';
import { PostAdminGetListForApplicationResponse } from './response/post-admin-get-list-application.response';
import { PostAdminGetListResponse } from './response/post-admin-get-list.response';
import { PostAdminGetCountRequest } from './request/post-admin-get-count.request';
import { CountResponse } from 'utils/generics/count.response';

@Controller('/admin/posts')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class PostAdminController {
    constructor(private postAdminService: PostAdminService) {}

    @Get()
    async getList(@Query() query: PostAdminGetListRequest): Promise<BaseResponse<PostAdminGetListResponse>> {
        const posts = await this.postAdminService.getList(query);
        return BaseResponse.of(posts);
    }

    @Get('/application')
    async getListForApplication(
        @Query() query: PostAdminGetListForApplicationRequest,
    ): Promise<BaseResponse<PostAdminGetListForApplicationResponse>> {
        return BaseResponse.of(await this.postAdminService.getListForApplication(query));
    }

    @Get('/count')
    async getCount(@Query() query: PostAdminGetCountRequest): Promise<BaseResponse<CountResponse>> {
        return BaseResponse.of(await this.postAdminService.getCount(query));
    }

    @Patch('/pullup')
    async updatePullup(@Body() payload: PostAdminUpdatePullupRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postAdminService.updatePullup(payload));
    }

    @Patch('/type')
    async updatePostType(@Body() payload: PostAdminUpdateTypeRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postAdminService.updatePostType(payload));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<PostAdminGetDetailResponse>> {
        return BaseResponse.of(await this.postAdminService.getDetail(id));
    }

    // Change post information
    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: PostAdminUpdateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postAdminService.update(id, payload));
    }

    @Patch('/:id/exposure/')
    async updateExposure(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: PostAdminUpdateExposureRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postAdminService.updateExposure(id, payload));
    }

    @Delete('/:id')
    async deletePost(@Param('id', ParseIntPipe) id: number, @Query() query: PostAdminDeleteRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postAdminService.deletePost(id, query));
    }
}
