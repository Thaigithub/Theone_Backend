import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';

import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PointAdminService } from './point-admin.service';
import { PointAdminGetListRequest } from './request/point-admin-get-list.request';
import { PointAdminUpdateRequest } from './request/point-admin-update.request';
import { PointAdminGetListResponse } from './response/point-admin-get-list.response';

@Controller('/admin/points')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class PointAdminController {
    constructor(private pointAdminService: PointAdminService) {}

    @Get()
    async getList(@Query() query: PointAdminGetListRequest): Promise<BaseResponse<PointAdminGetListResponse>> {
        return BaseResponse.of(await this.pointAdminService.getList(query));
    }

    @Patch('/:id/status')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: PointAdminUpdateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.pointAdminService.update(id, body));
    }
}
