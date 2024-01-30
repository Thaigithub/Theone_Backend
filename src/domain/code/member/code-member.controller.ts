import { Controller, Get, UseGuards } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountType } from '@prisma/client';
import { CodeMemberService } from './code-member.service';
import { CodeMemberGetListResponse } from './response/code-member-get-list.response';

@Controller('/member/codes')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class CodeMemberController {
    constructor(private readonly codeMemberService: CodeMemberService) {}

    @Get()
    async getList(): Promise<BaseResponse<CodeMemberGetListResponse[]>> {
        return BaseResponse.of(await this.codeMemberService.getList());
    }
}
