import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CountResponse } from 'utils/generics/count.response';
import { ApplicationAdminService } from './application-admin.service';
import { ApplicationAdminGetCountRequest } from './request/application-admin-get-count.request';
import { ApplicationAdminGetListPostRequest } from './request/application-admin-get-list-post.request';
import { ApplicationAdminGetDetailResponse } from './response/application-admin-get-detail.response';
import { ApplicationAdminGetLisPostResponse } from './response/application-admin-get-list-post.response';

@Controller('/admin/applications')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ApplicationAdminController {
    constructor(private applicationAdminService: ApplicationAdminService) {}

    @Get('/post/:postId')
    async getListPost(
        @Param('postId', ParseIntPipe) id: number,
        @Query() query: ApplicationAdminGetListPostRequest,
    ): Promise<BaseResponse<ApplicationAdminGetLisPostResponse>> {
        return BaseResponse.of(await this.applicationAdminService.getListPost(id, query));
    }

    @Get('/count')
    async getCount(@Query() query: ApplicationAdminGetCountRequest): Promise<BaseResponse<CountResponse>> {
        return BaseResponse.of(await this.applicationAdminService.getCount(query));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<ApplicationAdminGetDetailResponse>> {
        return BaseResponse.of(await this.applicationAdminService.getDetail(id));
    }
}
