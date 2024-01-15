import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CodeAdminGetListRequest } from '../admin/request/code-admin-get-list.request';
import { CodeAdminGetListResponse } from '../admin/response/code-admin-get-list.response';
import { CodeCompanyService } from './code-company.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('company/code')
export class CodeCompanyController {
    constructor(private readonly codeCompanyService: CodeCompanyService) {}

    @Get()
    async getList(@Query() query: CodeAdminGetListRequest): Promise<BaseResponse<CodeAdminGetListResponse>> {
        const code = await this.codeCompanyService.getList(query);
        return BaseResponse.of(code);
    }
}
