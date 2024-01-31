import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BannerStatus, PostStatus, PostType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { StorageService } from 'services/storage/storage.service';

@Injectable()
export class CronJobService {
    constructor(
        private prismaService: PrismaService,
        private storageService: StorageService,
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
                questionReport: null,
                answerReport: null,
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
        // const currentDate = new Date(); // Lấy ngày hiện tại
        // const previousDate = new Date(currentDate); // Tạo một đối tượng date mới với ngày hiện tại

        // previousDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000);
        // const deadlineInterestPost = await this.prismaService.interest.findMany({
        //     where: {
        //         NOT: { post: null},
        //         post: {
        //             updatedAt: { lte: }
        //             endDate: {}
        //         }
        //     }
        // });
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
}
