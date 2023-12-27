import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { LaborCompanyService } from './labor-company.service';
import { LaborCompanyGetListRequest } from './request/labor-company-get-list.request';
import { LaborCompanyGetListResponse } from './response/labor-company-get-list.response';

@ApiTags('[COMPANY] Labor Management')
@Controller('/company/labors')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
export class LaborCompanyController {
    constructor(private laborCompanyService: LaborCompanyService) {}
    @Get()
    async getList(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: LaborCompanyGetListRequest,
    ): Promise<BaseResponse<LaborCompanyGetListResponse>> {
        return BaseResponse.of(await this.laborCompanyService.getList(req.user.accountId, query));
    }
}
