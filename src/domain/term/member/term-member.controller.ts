import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { TermMemberGetListRequest } from './request/term-member-get-list.request';
import { TermMemberGetListResponse } from './response/term-member-get-list.response';
import { TermMemberService } from './term-member.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
@Controller('/member/terms')
export class TermMemberController {
    constructor(private termMemberService: TermMemberService) {}

    @Get()
    async getList(@Query() query: TermMemberGetListRequest): Promise<BaseResponse<TermMemberGetListResponse>> {
        return BaseResponse.of(await this.termMemberService.getList(query));
    }
}
