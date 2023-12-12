import { Controller, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { CompanyCompanyService } from './company-company.service';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';

@ApiTags('[COMPANY] Company Management')
@Controller('/member/companies')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class CompanyCompanyController {
    constructor(private companyCompanyService: CompanyCompanyService) {}
}
