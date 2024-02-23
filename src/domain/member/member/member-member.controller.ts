import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { MemberMemberService } from './member-member.service';
import { MemberMemberGetOneRequest } from './request/member-member-get-one.request';
import { MemberMemberGetOneResponse } from './response/member-member-get-one.response';

@Controller('/member/members')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class MemberMemberController {
    constructor(private memberMemberService: MemberMemberService) {}
    @Get()
    async getOne(@Query() query: MemberMemberGetOneRequest): Promise<BaseResponse<MemberMemberGetOneResponse>> {
        return BaseResponse.of(await this.memberMemberService.getOne(query));
    }
}
