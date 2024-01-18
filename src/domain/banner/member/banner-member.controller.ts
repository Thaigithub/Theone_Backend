import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { BannerMemberService } from './banner-member.service';
import { BannerMemberGetListResponse } from './response/banner-member-get-list.response';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountType } from '@prisma/client';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
@Controller('/member/banners')
export class BannerMemberController {
    constructor(private bannerMemberService: BannerMemberService) {}

    @Get()
    async getList(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<BannerMemberGetListResponse>> {
        return BaseResponse.of(await this.bannerMemberService.getList(request.user.accountId));
    }
}
