import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FunctionName } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
export const PERMISSION_KEY = 'permission';
export const FunctionPermission = (permission: FunctionName) => SetMetadata(PERMISSION_KEY, permission);

@Injectable()
export class AuthPermissionGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const account = request.user;
        const requiredPermission = this.reflector.getAllAndOverride<FunctionName>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const admin = await this.prisma.admin.findUnique({
            where: {
                accountId: account.accountId,
            },
            select: {
                permissions: {
                    select: { function: { select: { name: true } } },
                },
            },
        });
        if (!admin) return false;
        const permissions = admin.permissions?.map((p) => p.function.name);
        if (permissions.includes(requiredPermission)) return true;
        return false;
    }
}
