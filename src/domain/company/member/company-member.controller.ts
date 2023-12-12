import { Controller, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { MemberCompanyService } from './company-member.service';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';

@ApiTags('[MEMBER] Company Management')
@Controller('/member/companies')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberCompanyController {
    constructor(private memberCompanyService: MemberCompanyService) {}
}
