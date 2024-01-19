import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminLevel } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
export const ADMIN_LEVEL_KEY = 'admin_level';
export const AdminLevelPermissions = (adminLevel: AdminLevel) => SetMetadata(ADMIN_LEVEL_KEY, adminLevel);

@Injectable()
export class AuthAdminLevelGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const account = request.user;
        const requiredAdminLevel = this.reflector.getAllAndOverride<AdminLevel>(ADMIN_LEVEL_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const admin = await this.prisma.admin.findUnique({
            where: {
                accountId: account.accountId,
                isActive: true,
            },
        });
        if (!admin) return false;
        const adminLevel = admin.level;
        if (adminLevel === requiredAdminLevel) return true;
        return false;
    }
}
