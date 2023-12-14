import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PostAdminPostStatusFilter, PostAdminPostTypeFilter, PostAdminSearchCategoryFilter } from './dto/post-admin-filter';
import { PostAdminService } from './post-admin.service';
import { PostAdminGetListRequest } from './request/post-admin-get-list.request';
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
}
