import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { AnnouncementAdminService } from './announcement-admin.service';
import { AnnouncementAdminCreateRequest } from './request/announcement-admin-create.request';
import { AnnouncementAdminGetListRequest } from './request/announcement-admin-get-list.request';
import { AnnouncementAdminGetDetailResponse } from './response/announcement-admin-get-detail.response';
import { AnnouncementAdminGetListResponse } from './response/announcement-admin-get-list.response';

@Controller('/admin/announcements')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class AnnouncementAdminController {
    constructor(private announcementAdminService: AnnouncementAdminService) {}

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<AnnouncementAdminGetDetailResponse>> {
        return BaseResponse.of(await this.announcementAdminService.getDetail(id));
    }

    @Put('/:id')
    async update(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AnnouncementAdminCreateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.announcementAdminService.update(request.user.accountId, id, body));
    }

    @Delete()
    async delete(
        @Req() request: BaseRequest,
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.announcementAdminService.delete(request.user.accountId, ids));
    }

    @Get()
    async getList(@Query() query: AnnouncementAdminGetListRequest): Promise<BaseResponse<AnnouncementAdminGetListResponse>> {
        return BaseResponse.of(await this.announcementAdminService.getList(query));
    }

    @Post()
    async createAnnouncement(@Req() request: BaseRequest, @Body() body: AnnouncementAdminCreateRequest) {
        return BaseResponse.of(await this.announcementAdminService.createAnnouncement(request.user.accountId, body));
    }
}
