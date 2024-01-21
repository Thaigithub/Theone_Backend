import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { LaborMemberService } from './labor-member.service';
import { LaborMemberGetTotalWorkDateResponse } from './response/labor-member-get-total-workdate.response';

@Controller('/member/labors')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class LaborMemberController {
    constructor(private readonly laborMemberService: LaborMemberService) {}

    @Get('/workdate/count')
    async getTotalWorkDate(@Req() request: BaseRequest): Promise<BaseResponse<LaborMemberGetTotalWorkDateResponse>> {
        return BaseResponse.of(await this.laborMemberService.getTotalWorkDate(request.user.accountId));
    }
}
