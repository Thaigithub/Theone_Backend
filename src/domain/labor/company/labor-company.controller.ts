import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { LaborCompanyService } from './labor-company.service';

@ApiTags('[COMPANY] Labor Management')
@Controller('/company/labors')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
export class LaborCompanyController {
    constructor(private laborCompanyService: LaborCompanyService) {}
    @Get()
    async getList() {}
}
