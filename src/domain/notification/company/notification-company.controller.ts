import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, Req, Request, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { BaseRequest } from '../../../utils/generics/base.request';
import { BaseResponse } from '../../../utils/generics/base.response';
import { AuthJwtGuard } from '../../auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from '../../auth/auth-role.guard';
import { NotificationCompanyService } from './notification-company.service';
import { NotificationCompanyGetListResponse } from './response/company-notification.response';

@Controller('/company/notifications')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class NotificationCompanyController {
    constructor(private notificationCompanyService: NotificationCompanyService) {}

    @Get()
    async getList(
        @Query() query: PaginationRequest,
        @Request() request: BaseRequest,
    ): Promise<BaseResponse<NotificationCompanyGetListResponse>> {
        return BaseResponse.of(await this.notificationCompanyService.getList(query, request.user.accountId));
    }

    @Patch('/:id/status')
    async update(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.notificationCompanyService.update(req.user.accountId, id));
    }

    @Delete('/:id')
    async deleteNotification(
        @Param('id', ParseIntPipe) id: number,
        @Request() request: BaseRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.notificationCompanyService.delete(id, request.user.accountId));
    }
}
