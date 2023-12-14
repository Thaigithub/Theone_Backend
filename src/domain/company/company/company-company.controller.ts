import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { CompanyCompanyService } from './company-company.service';

@ApiTags('[COMPANY] Company Management')
@Controller('/member/companies')
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class CompanyCompanyController {
    constructor(private companyCompanyService: CompanyCompanyService) {}
}
