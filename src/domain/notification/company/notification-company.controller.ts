import { Controller, Delete, Get, Param, ParseIntPipe, Query, Request, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { AccountIdExtensionRequest } from '../../../utils/generics/base.request';
import { BaseResponse } from '../../../utils/generics/base.response';
import { AuthJwtGuard } from '../../auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from '../../auth/auth-role.guard';
import { NotificationCompanyGetListResponse } from './response/company-notification.response';
import { NotificationCompanyService } from './notification-company.service';

@Controller('/company/notifications')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class NotificationCompanyController {
    constructor(private notificationCompanyService: NotificationCompanyService) {}

    @Get()
    async getList(
        @Query() query: PaginationRequest,
        @Request() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<NotificationCompanyGetListResponse>> {
        return BaseResponse.of(await this.notificationCompanyService.getList(query, request.user.accountId));
    }

    @Delete('/:id')
    async deleteNotification(
        @Param('id', ParseIntPipe) id: number,
        @Request() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.notificationCompanyService.delete(id, request.user.accountId));
    }
}
