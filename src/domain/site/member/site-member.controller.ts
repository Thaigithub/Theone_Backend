import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { SiteMemberGetListRequest } from './request/site-member-get-list.request';
import { SiteMemberGetDetailResponse } from './response/site-member-get-detail.response';
import { SiteMemberGetListResponse } from './response/site-member-get-list.response';
import { SiteMemberUpdateInterestResponse } from './response/site-member-update-interest.response';
import { SiteMemberService } from './site-member.service';

@Controller('/member/sites')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class SiteMemberController {
    constructor(private siteMemberService: SiteMemberService) {}

    @Post('/:id/interest')
    async updateInterest(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<SiteMemberUpdateInterestResponse>> {
        return BaseResponse.of(await this.siteMemberService.updateInterest(request.user.accountId, id));
    }

    @Get('/:id')
    async getDetail(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<SiteMemberGetDetailResponse>> {
        return BaseResponse.of(await this.siteMemberService.getDetail(request.user.accountId, id));
    }

    @Get()
    async getList(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: SiteMemberGetListRequest,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<SiteMemberGetListResponse>> {
        return BaseResponse.of(await this.siteMemberService.getList(request.user.accountId, { ...query, regionList }));
    }
}
