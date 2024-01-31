import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberLevel } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
export const MEMBER_LEVEL_KEY = 'member_level';
export const MemberLevelPermissions = (memberLevels: MemberLevel[]) => SetMetadata(MEMBER_LEVEL_KEY, memberLevels);

@Injectable()
export class AuthMemberLevelGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const account = request.user;
        const requiredmemberLevels = this.reflector.getAllAndOverride<MemberLevel>(MEMBER_LEVEL_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const member = await this.prisma.member.findUnique({
            where: {
                accountId: account.accountId,
                isActive: true,
            },
        });
        if (!member) return false;
        const memberLevel = member.level;
        if (requiredmemberLevels.includes(memberLevel)) return true;
        return false;
    }
}
