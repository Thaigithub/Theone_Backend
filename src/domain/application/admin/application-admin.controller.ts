import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import {
    ApplicationAdminSearchCategoryFilter,
    ApplicationAdminSortFilter,
    ApplicationAdminStatusFilter,
} from './dto/application-admin-filter';
import { ApplicationAdminGetListRequest } from './request/application-admin-get-list.request';
import { ApplicationAdminService } from './application-admin.service';
import { ApplicationAdminGetListResponse } from './response/application-admin-get-list.response';

@ApiTags('[ADMIN] Application Management')
@Controller('/admin/applications')
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
        type: ApplicationAdminGetListRequest,
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
    async getList(@Query() query: ApplicationAdminGetListRequest): Promise<BaseResponse<ApplicationAdminGetListResponse>> {
        const applications = await this.applicationAdminService.getList(query);
        return BaseResponse.of(applications);
    }
}
