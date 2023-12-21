import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApplicationAdminService } from './application-admin.service';
import {
    ApplicationAdminSearchCategoryFilter,
    ApplicationAdminSortFilter,
    ApplicationAdminStatusFilter,
} from './dto/application-admin-filter';
import { ApplicationAdminGetPostListRequest } from './request/application-admin-get-list-post.request';
import { ApplicationAdminGetPostListResponse } from './response/application-admin-get-list-post.response';

@ApiTags('[ADMIN] Application Management')
@Controller('/admin/applications')
@ApiBearerAuth()
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
export class ApplicationAdminController {
    constructor(private applicationAdminService: ApplicationAdminService) {}

    @Get()
    @ApiOperation({
        summary: 'Listing announcements',
        description: 'Admin can search announcements by many conditions.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The announcement lists retrieved successfully',
        type: ApplicationAdminGetPostListRequest,
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({
        name: 'status',
        type: 'enum',
        enum: ApplicationAdminStatusFilter,
        required: false,
    })
    @ApiQuery({
        name: 'searchCategory',
        type: 'enum',
        enum: ApplicationAdminSearchCategoryFilter,
        required: false,
    })
    @ApiQuery({
        name: 'sortByApplication',
        type: 'enum',
        enum: ApplicationAdminSortFilter,
        required: false,
    })
    @ApiQuery({
        name: 'searchTerm',
        type: String,
        required: false,
        description: 'Any text to search, for example: "The One"',
    })
    async getAnnouncementList(
        @Query() query: ApplicationAdminGetPostListRequest,
    ): Promise<BaseResponse<ApplicationAdminGetPostListResponse>> {
        const postList = await this.applicationAdminService.getPostList(query);
        return BaseResponse.of(postList);
    }
}
