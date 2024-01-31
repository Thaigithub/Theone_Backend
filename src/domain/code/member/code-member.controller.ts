import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CodeAdminGetListRequest } from '../admin/request/code-admin-get-list.request';
import { CodeAdminGetListResponse } from '../admin/response/code-admin-get-list.response';
import { CodeMemberService } from './code-member.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
@Controller('/member/codes')
export class CodeMemberController {
    constructor(private codeMemberService: CodeMemberService) {}

    @Get()
    async getList(@Query() query: CodeAdminGetListRequest): Promise<BaseResponse<CodeAdminGetListResponse>> {
        return BaseResponse.of(await this.codeMemberService.getList(query));
    }
}
