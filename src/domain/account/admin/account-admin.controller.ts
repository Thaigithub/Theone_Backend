import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { BaseRequest } from '../../../utils/generics/base.request';
import { AccountAdminService } from './account-admin.service';
import { AccountAdminUpdatePasswordRequest } from './request/account-admin-update-password.request';
import { AccountAdminGetDetailResponse } from './response/account-admin-get-detail.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('/admin/accounts')
export class AccountAdminController {
    constructor(private accountAdminService: AccountAdminService) {}

    @Get()
    async getDetail(@Req() request: BaseRequest): Promise<BaseResponse<AccountAdminGetDetailResponse>> {
        return BaseResponse.of(await this.accountAdminService.getDetail(request.user.accountId));
    }

    @Patch('/password')
    async updatePassword(
        @Req() request: BaseRequest,
        @Body() body: AccountAdminUpdatePasswordRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountAdminService.updatePassword(request.user.accountId, body));
    }
}
