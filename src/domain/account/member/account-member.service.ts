import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AccountType, MemberLevel, SignupMethodType } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'services/prisma/prisma.service';
import { MemberAccountSignupRequest } from './resquest/account-member-signup.request';
@Injectable()
export class AccountMemberService {
    constructor(private prismaService: PrismaService) {}
    async signup(request: MemberAccountSignupRequest): Promise<void> {
        if (request.recommenderId !== undefined) {
            const numRecommender = await this.prismaService.account.count({
                where: {
                    username: request.recommenderId,
                },
            });
            if (numRecommender !== 1) throw new NotFoundException('Recommender userId not found');
        }
        const numAccount = await this.prismaService.account.count({
            where: {
                username: request.username,
            },
        });
        if (numAccount !== 0) throw new BadRequestException('UserId has been used');
        await this.prismaService.account.create({
            data: {
                username: request.username,
                password: await hash(request.password, 10),
                type: AccountType.MEMBER,
                status: AccountStatus.APPROVED,
                member: {
                    create: {
                        name: request.name,
                        level: MemberLevel.THREE,
                        signupMethod: SignupMethodType.GENERAL,
                    },
                },
            },
        });
    }
    async accountMemberCheck(username: string): Promise<boolean> {
        const accountNum = await this.prismaService.account.count({
            where: {
                username: username,
            },
        });
        if (accountNum === 0) return true;
        return false;
    }
    async accountRecommenderCheck(username: string): Promise<boolean> {
        const accountNum = await this.prismaService.account.count({
            where: {
                username: username,
            },
        });
        if (accountNum !== 0) return true;
        return false;
    }
}
