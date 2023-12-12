import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType, AdminLevel } from '@prisma/client';
import { AdminLevelPermissions, AuthAdminLevelGuard } from 'domain/auth/auth-admin-level.guard';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';

import { BaseResponse } from 'utils/generics/base.response';
import { AdminAdminService } from './admin-admin.service';
import { AdminAdminGetListRequest } from './request/admin-admin-get-list.request';
import { AdminAdminUpsertRequest } from './request/admin-admin-upsert.request';
import { AdminAdminDetailResponse } from './response/admin-admin-detail.response';
import { AdminAdminGetListResponse } from './response/admin-admin-get-list.response';

@ApiTags('[ADMIN] Admin Management')
@Controller('/admin/admins')
@Roles(AccountType.ADMIN)
@AdminLevelPermissions(AdminLevel.SUPERADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard, AuthAdminLevelGuard)
export class AdminAdminController {
    constructor(@Inject(AdminAdminService) private readonly adminService: AdminAdminService) {}

    // Get members list by conditions
    @Get()
    @ApiOperation({
        summary: 'Listing administrator',
        description: 'Admin can search admins by id, name, or can filter by level',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The admin list retrieved successfully',
        type: AdminAdminGetListResponse,
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({ name: 'level', type: String, required: false, description: 'Filter by level,: ALL, GENERAL, SUPERADMIN' })
    @ApiQuery({ name: 'keyword', type: String, required: false, description: 'Keyword for search' })
    @ApiQuery({ name: 'searchCategory', type: String, required: false, description: 'Category for search: ALL, ID, ADMIN_NAME' })
    async getList(@Query() query: AdminAdminGetListRequest): Promise<BaseResponse<AdminAdminGetListResponse>> {
        const admins = await this.adminService.getList(query);
        return BaseResponse.of(admins);
    }

    @Post('/create')
    @ApiOperation({
        summary: 'Create Admin account',
        description: 'This endpoint creates a admin account in the system',
    })
    @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async create(@Body() request: AdminAdminUpsertRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminService.create(request));
    }

    // Get admin detail
    @Get('/:id')
    @ApiOperation({
        summary: 'Get admin detail',
        description: 'Retrieve admin information detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: AdminAdminDetailResponse,
    })
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<AdminAdminDetailResponse>> {
        return BaseResponse.of(await this.adminService.getMemberDetails(id));
    }

    // Change admin information
    @Patch('/:id')
    @ApiOperation({
        summary: 'Change admin information',
        description: 'Admin can change admin information',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async changeAdminInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: AdminAdminUpsertRequest,
    ): Promise<BaseResponse<void>> {
        await this.adminService.changeAdminInfo(id, payload);
        return BaseResponse.ok();
    }

    @Delete('/:id')
    @ApiOperation({
        summary: 'Delete admin',
        description: 'Admin can delete a admin account',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async deleteAdmin(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminService.deleteAdmin(id));
    }
}
