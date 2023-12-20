import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PostAdminPostStatusFilter, PostAdminPostTypeFilter, PostAdminSearchCategoryFilter } from './dto/post-admin-filter';
import { PostAdminService } from './post-admin.service';
import { PostAdminDeleteRequest } from './request/post-admin-delete.request';
import { PostAdminGetListRequest } from './request/post-admin-get-list.request';
import { PostAdminModifyRequest } from './request/post-admin-modify-request';
import { PostAdminDetailResponse } from './response/post-admin-detail.response';
import { PostAdminGetListResponse } from './response/post-admin-get-list.response';

@ApiTags('[ADMIN] Posts Management')
@Controller('/admin/posts')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
export class PostAdminController {
    constructor(private postAdminService: PostAdminService) {}

    @Get()
    @ApiOperation({
        summary: 'Listing announcements',
        description: 'Admin can search announcements by many conditions.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The announcement lists retrieved successfully',
        type: PostAdminGetListRequest,
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({
        name: 'type',
        type: 'enum',
        enum: PostAdminPostTypeFilter,
        required: false,
    })
    @ApiQuery({
        name: 'status',
        type: 'enum',
        enum: PostAdminPostStatusFilter,
        required: false,
    })
    @ApiQuery({
        name: 'startDate',
        type: Date,
        required: false,
        description: 'Start date for search by format: YYYY-MM-DD',
    })
    @ApiQuery({
        name: 'endDate',
        type: Date,
        required: false,
        description: 'End date for search by format: YYYY-MM-DD',
    })
    @ApiQuery({
        name: 'searchCategory',
        type: 'enum',
        enum: PostAdminSearchCategoryFilter,
        required: false,
    })
    @ApiQuery({
        name: 'searchTerm',
        type: String,
        required: false,
        description: 'Any text to search, for example: "The One"',
    })
    async getList(@Query() query: PostAdminGetListRequest): Promise<BaseResponse<PostAdminGetListResponse>> {
        const posts = await this.postAdminService.getList(query);
        return BaseResponse.of(posts);
    }

    @Get('/:id')
    @ApiOperation({
        summary: 'Post detail',
        description: 'Retrieve detail information',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: PostAdminDetailResponse,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getDetail(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<PostAdminDetailResponse>> {
        return BaseResponse.of(await this.postAdminService.getPostDetails(id));
    }

    // Change post information
    @Patch('/:id')
    @ApiOperation({
        summary: 'Change post information',
        description: 'Company change post information',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async changePageInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: PostAdminModifyRequest,
    ): Promise<BaseResponse<void>> {
        await this.postAdminService.changePostInfo(id, payload);
        return BaseResponse.ok();
    }


    @Patch('/:id/exposure/')
    @ApiOperation({
        summary: 'Change post information',
        description: 'Company change post information',
    })
    @ApiQuery({
        name: 'isHidden',
        type: Boolean,
        required: false,
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async changeHiddenStatus(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: PostAdminModifyRequest,
    ): Promise<BaseResponse<void>> {
        await this.postAdminService.changeHiddenStatus(id, request);
        return BaseResponse.ok();
    }

    @Delete('/:id')
    @ApiOperation({
        summary: 'Delete post',
        description: 'Admin can delete a job post',
    })
    @ApiQuery({
        name: 'deleteReason',
        type: String,
        required: false,
        description: 'Any text to delete, for example: "The One"',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Delete job post successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Delete job post failed' })
    async deletePost(@Param('id', ParseIntPipe) id: number, @Query() query: PostAdminDeleteRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postAdminService.deletePost(id, query));
    }
}
