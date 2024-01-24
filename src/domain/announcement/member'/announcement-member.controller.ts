import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { AnnouncementMemberService } from './announcement-member.service';
import { AnnouncementMemberGetListRequest } from './request/announcement-member-get-list.request';
import { AnnouncementMemberGetDetailResponse } from './response/announcement-member-get-detail.response';
import { AnnouncementMemberGetListResponse } from './response/announcement-member-get-list.response';

@Controller('/member/announcements')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class AnnouncementMemberController {
    constructor(private announcementMemberService: AnnouncementMemberService) {}

    @Get()
    async getList(@Query() query: AnnouncementMemberGetListRequest): Promise<BaseResponse<AnnouncementMemberGetListResponse>> {
        return BaseResponse.of(await this.announcementMemberService.getList(query));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<AnnouncementMemberGetDetailResponse>> {
        return BaseResponse.of(await this.announcementMemberService.getDetail(id));
    }
}
