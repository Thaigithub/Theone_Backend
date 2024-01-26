import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BannerStatus, PostStatus, PostType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class CronJobService {
    constructor(private readonly prismaService: PrismaService) {}

    @Cron(CronExpression.EVERY_HOUR)
    async resetFreePullUpPost() {
        await this.prismaService.post.updateMany({
            data: {
                freePullUp: true,
                nextFreePulledUpTime: null,
            },
            where: {
                isActive: true,
                freePullUp: false,
                nextFreePulledUpTime: { lt: new Date() },
            },
        });
    }

    @Cron(CronExpression.EVERY_HOUR)
    async disablePullUpPost() {
        await this.prismaService.post.updateMany({
            data: {
                isPulledUp: false,
                pullUpExpirationTime: null,
            },
            where: {
                isActive: true,
                isPulledUp: true,
                pullUpExpirationTime: { lt: new Date() },
            },
        });
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async changePostStatus() {
        await this.prismaService.post.updateMany({
            data: {
                status: PostStatus.DEADLINE,
            },
            where: {
                isActive: true,
                status: { not: PostStatus.DEADLINE },
                endDate: { lt: new Date() },
            },
        });
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async changePostType() {
        await this.prismaService.post.updateMany({
            data: {
                type: PostType.COMMON,
                premiumExpirationTime: null,
            },
            where: {
                isActive: true,
                type: PostType.PREMIUM,
                OR: [
                    {
                        premiumExpirationTime: { lt: new Date() },
                    },
                    {
                        endDate: { lt: new Date() },
                    },
                ],
            },
        });
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async updateMemberExperience() {
        const expiredContractList = (
            await this.prismaService.member.findMany({
                include: {
                    applyPosts: {
                        include: {
                            contract: true,
                        },
                        where: {
                            contract: {
                                is: {
                                    startDate: { lte: new Date() },
                                },
                            },
                        },
                    },
                },
                where: {
                    isActive: true,
                },
            })
        )
            .filter((item) => item.applyPosts.length !== 0)
            .map((member) => {
                return {
                    id: member.id,
                    contractList: member.applyPosts.map((application) => {
                        return {
                            startDate: application.contract.startDate,
                            endDate: application.contract.endDate,
                        };
                    }),
                };
            });
        await Promise.all(
            expiredContractList.map(async (member) => {
                const totalMonths = member.contractList.reduce((totalMonths, contract) => {
                    return contract.endDate.getTime() < new Date().getTime()
                        ? totalMonths +
                              Math.floor((contract.endDate.getTime() - contract.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
                        : totalMonths +
                              Math.floor((new Date().getTime() - contract.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
                }, 0);
                const totalExperienceYears = Math.floor(totalMonths / 12);
                const totalExperienceMonths = totalMonths - totalExperienceYears * 12;
                await this.prismaService.member.update({
                    data: {
                        totalExperienceYears,
                        totalExperienceMonths,
                    },
                    where: {
                        isActive: true,
                        id: member.id,
                    },
                });
            }),
        );
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async hideBanner() {
        await this.prismaService.banner.updateMany({
            data: {
                status: BannerStatus.HIDE,
            },
            where: {
                isActive: true,
                status: BannerStatus.EXPOSE,
                endDate: { lt: new Date() },
            },
        });
    }
}
