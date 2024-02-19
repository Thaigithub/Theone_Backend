import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { NotificationMemberService } from './notification-member.service';
import { NotificationMemberGetListRequest } from './request/notification-member-get-list.request';
import { NotificationMemberGetListResponse } from './response/notification-member-get-list.response';

@Controller('/member/notifications')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class NotificationMemberController {
    constructor(private notificationMemberService: NotificationMemberService) {}

    @Get()
    async getList(
        @Req() req: BaseRequest,
        @Query() query: NotificationMemberGetListRequest,
    ): Promise<BaseResponse<NotificationMemberGetListResponse>> {
        return BaseResponse.of(await this.notificationMemberService.getList(req.user.accountId, query));
    }

    @Patch('/:id/status')
    async update(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.notificationMemberService.update(req.user.accountId, id));
    }

    @Delete('/:id')
    async delete(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.notificationMemberService.delete(req.user.accountId, id));
    }
}
