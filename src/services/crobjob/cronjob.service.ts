import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BannerStatus, NotificationType, PostStatus, PostType } from '@prisma/client';
import { NotificationCompanyService } from 'domain/notification/company/notification-company.service';
import { NotificationMemberService } from 'domain/notification/member/notification-member.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { StorageService } from 'services/storage/storage.service';

@Injectable()
export class CronJobService {
    constructor(
        private prismaService: PrismaService,
        private storageService: StorageService,
        private readonly notificationMemberService: NotificationMemberService,
        private readonly notificationCompanyService: NotificationCompanyService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deleteUnusedFile() {
        await this.prismaService.file.deleteMany({
            where: {
                attachment: null,
                banner: null,
                contract: null,
                foreignWorker: null,
                basicHealthSafetyCertificate: null,
                license: null,
                taxBill: null,
                cardReceipt: null,
                announcementFile: null,
                disability: null,
                questionInquiryFile: null,
                answerInquiryFile: null,
                faqFile: null,
                reportFile: null,
                questionLaborConsultationFile: null,
                answerLaborConsultationFile: null,
                point: null,
                logo: null,
                contactCard: null,
            },
        });
        const databaseKeys = (await this.prismaService.file.findMany()).map((item) => item.key);
        await Promise.all(
            (await this.storageService.getListKey())
                .filter((item) => !databaseKeys.includes(item))
                .map(async (item) => {
                    await this.storageService.deleteFile(item);
                }),
        );
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async notifySite() {
        // Calculate the datetime that is 1 day ago
        const currentDate = new Date();
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getTime() - 24 * 60 * 60 * 1000);
        const sites = await this.prismaService.site.findMany({
            where: {
                endDate: {
                    gte: previousDate,
                    lt: currentDate,
                },
            },
            select: {
                id: true,
                name: true,
                company: {
                    select: {
                        accountId: true,
                    },
                },
            },
        });
        sites.forEach(async (site) => {
            await this.notificationCompanyService.create(
                site.company.accountId,
                '현장 ' + site.name + ' 공사기간이 종료되었습니다.',
                '',
                NotificationType.SITE,
                site.id,
            );
        });
    }

    @Cron(CronExpression.EVERY_HOUR)
    async notifyPost() {
        const currentDate = new Date();
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getTime() + 24 * 60 * 60 * 1000);
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 24 * 60 * 60 * 1000);
        const posts = await this.prismaService.post.findMany({
            where: {
                endDate: {
                    gt: currentDate,
                    lte: nextDay,
                },
            },
            select: {
                id: true,
                interests: {
                    where: {
                        member: {
                            isActive: true,
                        },
                    },
                    select: {
                        member: {
                            select: {
                                accountId: true,
                            },
                        },
                    },
                },
            },
        });
        // Notify for member that the interest post has 1 day before deadline
        for (const post of posts) {
            for (const interest of post.interests) {
                const notification = await this.prismaService.notification.findFirst({
                    where: {
                        type: NotificationType.POST,
                        typeId: post.id,
                        createdAt: {
                            gt: previousDate,
                        },
                        accountId: interest.member.accountId,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
                if (!notification) {
                    await this.notificationMemberService.create(
                        interest.member.accountId,
                        '관심 공고 마갑 1일전!!!',
                        '관심 공고 마감 1일 전입니다.',
                        NotificationType.POST,
                        post.id,
                    );
                }
            }
        }
    }

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

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async changePostStatus() {
        const currentDate = new Date();
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getTime() - 24 * 60 * 60 * 1000);
        await this.prismaService.post.updateMany({
            data: {
                status: PostStatus.DEADLINE,
            },
            where: {
                isActive: true,
                status: { not: PostStatus.DEADLINE },
                endDate: {
                    lt: currentDate,
                    gte: previousDate,
                },
            },
        });
        const posts = await this.prismaService.post.findMany({
            where: {
                status: PostStatus.DEADLINE,
                endDate: { lt: new Date() },
                interests: {
                    some: {
                        member: {
                            isActive: true,
                        },
                    },
                },
            },
            select: {
                id: true,
                interests: {
                    where: {
                        member: {
                            isActive: true,
                        },
                    },
                    select: {
                        member: {
                            select: {
                                accountId: true,
                            },
                        },
                    },
                },
            },
        });

        // Notify for member that the interest post has been closed
        for (const post of posts) {
            for (const interest of post.interests) {
                const notification = await this.prismaService.notification.findFirst({
                    where: {
                        type: NotificationType.POST,
                        typeId: post.id,
                        accountId: interest.member.accountId,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
                if (!notification) {
                    await this.notificationMemberService.create(
                        interest.member.accountId,
                        '관심 공고 마감',
                        '관심 공고가 마감되었습니다',
                        NotificationType.POST,
                        post.id,
                    );
                }
            }
        }
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
                    applications: {
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
            .filter((item) => item.applications.length !== 0)
            .map((member) => {
                return {
                    id: member.id,
                    contractList: member.applications.map((application) => {
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

    @Cron(CronExpression.EVERY_MINUTE)
    async deleteDevice() {
        const currentTime = new Date();
        const previusHour = new Date(currentTime.getTime() - 1 * 60 * 60 * 1000);
        await this.prismaService.device.updateMany({
            where: {
                updatedAt: {
                    lt: previusHour,
                },
                isActive: true,
            },
            data: {
                isActive: false,
            },
        });
    }
}
