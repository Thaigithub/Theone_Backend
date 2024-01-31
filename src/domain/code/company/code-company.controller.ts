import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CodeAdminGetListRequest } from '../admin/request/code-admin-get-list.request';
import { CodeMemberGetListResponse } from '../member/response/code-member-get-list.response';
import { CodeCompanyService } from './code-company.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('/company/codes')
export class CodeCompanyController {
    constructor(private codeCompanyService: CodeCompanyService) {}

    @Get()
    async getList(@Query() query: CodeAdminGetListRequest): Promise<BaseResponse<CodeMemberGetListResponse>> {
        return BaseResponse.of(await this.codeCompanyService.getList(query));
    }
}
