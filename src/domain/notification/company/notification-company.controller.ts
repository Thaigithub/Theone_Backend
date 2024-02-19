import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, Req, Request, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { BaseRequest } from '../../../utils/generics/base.request';
import { BaseResponse } from '../../../utils/generics/base.response';
import { AuthJwtGuard } from '../../auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from '../../auth/auth-role.guard';
import { NotificationMemberService } from '../member/notification-member.service';
import { NotificationMemberGetListRequest } from '../member/request/notification-member-get-list.request';
import { NotificationMemberGetListResponse } from '../member/response/notification-member-get-list.response';

@Controller('/company/notifications')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class NotificationCompanyController {
    constructor(private notificationMemberService: NotificationMemberService) {}

    @Get()
    async getList(
        @Query() query: NotificationMemberGetListRequest,
        @Request() request: BaseRequest,
    ): Promise<BaseResponse<NotificationMemberGetListResponse>> {
        return BaseResponse.of(await this.notificationMemberService.getList(request.user.accountId, query));
    }

    @Patch('/:id/status')
    async update(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.notificationMemberService.update(req.user.accountId, id));
    }

    @Delete('/:id')
    async deleteNotification(
        @Param('id', ParseIntPipe) id: number,
        @Request() request: BaseRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.notificationMemberService.delete(id, request.user.accountId));
    }
}
