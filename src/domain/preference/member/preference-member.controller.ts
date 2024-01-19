import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PreferenceMemberService } from './preference-member.service';
import { PreferenceMemberGetDetailResponse } from './response/preference-member-get-preference.response';

@Controller('member/preferences')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class PreferenceMemberController {
    constructor(private readonly preferenceMemberService: PreferenceMemberService) {}

    @Get()
    async getPreference(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<PreferenceMemberGetDetailResponse>> {
        return BaseResponse.of(await this.preferenceMemberService.getDetail(request.user.accountId));
    }
}
