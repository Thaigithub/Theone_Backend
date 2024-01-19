import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { WorkDateMemberService } from './workdate-member.service';

@Controller('/member/workdates')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class WorkDateMemberController {
    constructor(private readonly laborMemberService: WorkDateMemberService) {}

    @Get('count')
    async getTotal(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<number>> {
        return BaseResponse.of(await this.laborMemberService.getTotal(request.user.accountId));
    }
}
