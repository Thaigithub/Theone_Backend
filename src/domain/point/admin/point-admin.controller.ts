import { Controller, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { PointAdminService } from './point-admin.service';

@Controller('/admin/points')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class PointAdminController {
    constructor(private pointAdminService: PointAdminService) {}
}
