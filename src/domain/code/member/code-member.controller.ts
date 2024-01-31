import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CodeMemberService } from './code-member.service';
import { CodeMemberGetListResponse } from './response/code-member-get-list.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
@Controller('/member/codes')
export class CodeMemberController {
    constructor(private codeMemberService: CodeMemberService) {}

    @Get()
    async getList(): Promise<BaseResponse<CodeMemberGetListResponse[]>> {
        return BaseResponse.of(await this.codeMemberService.getList());
    }
}
