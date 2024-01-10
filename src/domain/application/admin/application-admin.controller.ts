import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApplicationAdminService } from './application-admin.service';
import { ApplicationAdminGetListRequest } from './request/application-admin-get-list.request';
import { ApplicationAdminGetDetailResponse } from './response/application-admin-get-detail.response';
import { ApplicationAdminGetResponse } from './response/application-admin-get-list.response';

@Controller('/admin/applications')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ApplicationAdminController {
    constructor(private applicationAdminService: ApplicationAdminService) {}

    @Get('/post/:postId')
    async getListForPost(
        @Param('postId', ParseIntPipe) id: number,
        @Query() query: ApplicationAdminGetListRequest,
    ): Promise<BaseResponse<ApplicationAdminGetResponse>> {
        return BaseResponse.of(await this.applicationAdminService.getListForPost(id, query));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<ApplicationAdminGetDetailResponse>> {
        return BaseResponse.of(await this.applicationAdminService.getDetail(id));
    }
}
