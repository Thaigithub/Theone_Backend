import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CodeAdminGetListRequest } from '../admin/request/code-admin-get-list.request';
import { CodeAdminGetListResponse } from '../admin/response/code-admin-get-list.response';
import { CodeCompanyService } from './code-company.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@Controller('company/code')
@ApiTags('[COMPANY] Code Management')
export class CodeCompanyController {
    constructor(private readonly codeCompanyService: CodeCompanyService) {}

    @Get()
    @ApiOperation({
        summary: 'Listing code',
        description: 'Company can search code by code type',
    })
    @ApiResponse({
        type: CodeAdminGetListResponse,
    })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({
        name: 'codeType',
        type: String,
        required: false,
        description: 'Code type for filter: ALL, SPECIAL_NOTE, JOB',
    })
    async getList(@Query() query: CodeAdminGetListRequest): Promise<BaseResponse<CodeAdminGetListResponse>> {
        const code = await this.codeCompanyService.getList(query);
        return BaseResponse.of(code);
    }
}
