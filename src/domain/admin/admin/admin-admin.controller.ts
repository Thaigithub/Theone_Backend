import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AccountType, AdminLevel } from '@prisma/client';
import { AdminLevelPermissions, AuthAdminLevelGuard } from 'domain/auth/auth-admin-level.guard';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { AdminAdminService } from './admin-admin.service';
import { AdminAdminGetListRequest } from './request/admin-admin-get-list.request';
import { AdminAdminUpsertRequest } from './request/admin-admin-upsert.request';
import { AdminAdminGetDetailResponse } from './response/admin-admin-detail.response';
import { AdminAdminGetListResponse } from './response/admin-admin-get-list.response';

@Controller('/admin/admins')
@Roles(AccountType.ADMIN)
@AdminLevelPermissions(AdminLevel.SUPERADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard, AuthAdminLevelGuard)
export class AdminAdminController {
    constructor(private adminService: AdminAdminService) {}

    @Get()
    async getList(@Query() query: AdminAdminGetListRequest): Promise<BaseResponse<AdminAdminGetListResponse>> {
        return BaseResponse.of(await this.adminService.getList(query));
    }

    @Post()
    async create(@Body() request: AdminAdminUpsertRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminService.create(request));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<AdminAdminGetDetailResponse>> {
        return BaseResponse.of(await this.adminService.getDetail(id));
    }

    @Patch('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: AdminAdminUpsertRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminService.update(id, payload));
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminService.delete(id));
    }
}
