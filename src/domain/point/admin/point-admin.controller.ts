import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PointAdminService } from './point-admin.service';
import { PointAdminGetListRequest } from './request/point-admin-get-list.request';
import { PointAdminGetDetailResponse } from './response/point-admin-get-detail.response';
import { PointAdminGetListResponse } from './response/point-admin-get-list.response';
import { PointAdminGetMemberListResponse } from './response/point-admin-get-member-list.response';

@Controller('/admin/points')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class PointAdminController {
    constructor(private pointAdminService: PointAdminService) {}
    @Get('/members')
    async getMemberList(@Query() query: PointAdminGetListRequest): Promise<BaseResponse<PointAdminGetMemberListResponse>> {
        return BaseResponse.of(await this.pointAdminService.getMemberList(query));
    }

    @Get('/members/:id')
    async getList(
        @Param('id', ParseIntPipe) id: number,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<PointAdminGetListResponse>> {
        return BaseResponse.of(await this.pointAdminService.getList(id, query));
    }

    @Get('/members/:id/general')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<PointAdminGetDetailResponse>> {
        return BaseResponse.of(await this.pointAdminService.getDetail(id));
    }
}
