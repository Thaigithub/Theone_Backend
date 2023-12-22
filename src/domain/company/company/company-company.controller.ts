import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CompanyCompanyService } from './company-company.service';
import { CompanyCompanyGetDetail } from './response/company-company-get-detail.response';

@ApiTags('[COMPANY] Company Management')
@Controller('/company/companies')
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class CompanyCompanyController {
    constructor(private companyCompanyService: CompanyCompanyService) {}

    @Get('/detail')
    async getDetail(@Req() req: any): Promise<BaseResponse<CompanyCompanyGetDetail>> {
        return BaseResponse.of(await this.companyCompanyService.getDetail(req.user.accountId));
    }
}
