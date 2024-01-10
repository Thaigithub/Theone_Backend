import { Injectable } from '@nestjs/common';
import { CareerCertificationType, CareerType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GovernmentService {
    constructor(private readonly prismaService: PrismaService) {}

    async saveCertificationExperienceHealthInsurance(accountId: number): Promise<void> {
        await this.prismaService.$transaction(async (prisma) => {
            await prisma.career.deleteMany({
                where: {
                    member: {
                        accountId,
                    },
                    type: CareerType.CERTIFICATION,
                    certificationType: CareerCertificationType.HEALTH_INSURANCE,
                },
            });
            await prisma.member.update({
                where: {
                    accountId,
                },
                data: {
                    career: {
                        createMany: {
                            data: [
                                {
                                    companyName: 'HealthInsurance - company name 1',
                                    siteName: 'HealthInsurance - site name 1',
                                    startDate: new Date('2023-06-12'),
                                    endDate: new Date('2023-12-12'),
                                    type: CareerType.CERTIFICATION,
                                    certificationType: CareerCertificationType.HEALTH_INSURANCE,
                                    isExperienced: true,
                                    occupationId: 1,
                                },
                                {
                                    companyName: 'health insurance - company name 2',
                                    siteName: 'health insurance - site name 2',
                                    startDate: new Date('2023-05-12'),
                                    endDate: new Date('2023-11-12'),
                                    type: CareerType.CERTIFICATION,
                                    certificationType: CareerCertificationType.HEALTH_INSURANCE,
                                    isExperienced: true,
                                    occupationId: 1,
                                },
                            ],
                        },
                    },
                },
            });
        });
    }

    async saveCertificationExperienceEmploymentInsurance(accountId: number): Promise<void> {
        await this.prismaService.$transaction(async (prisma) => {
            await prisma.career.deleteMany({
                where: {
                    member: {
                        accountId,
                    },
                    type: CareerType.CERTIFICATION,
                    certificationType: CareerCertificationType.EMPLOYMENT_INSURANCE,
                },
            });
            await prisma.member.update({
                where: {
                    accountId,
                },
                data: {
                    career: {
                        createMany: {
                            data: [
                                {
                                    companyName: 'HealthInsurance - company name 1',
                                    siteName: 'HealthInsurance - site name 1',
                                    startDate: new Date('2023-06-12'),
                                    endDate: new Date('2023-12-12'),
                                    type: CareerType.CERTIFICATION,
                                    certificationType: CareerCertificationType.EMPLOYMENT_INSURANCE,
                                    isExperienced: true,
                                    occupationId: 1,
                                },
                                {
                                    companyName: 'health insurance - company name 2',
                                    siteName: 'health insurance - site name 2',
                                    startDate: new Date('2023-05-12'),
                                    endDate: new Date('2023-11-12'),
                                    type: CareerType.CERTIFICATION,
                                    certificationType: CareerCertificationType.EMPLOYMENT_INSURANCE,
                                    isExperienced: true,
                                    occupationId: 1,
                                },
                            ],
                        },
                    },
                },
            });
        });
    }

    async saveCertificationTheOneSite(accountId: number): Promise<void> {
        await this.prismaService.career.deleteMany({
            where: {
                member: {
                    accountId,
                },
                type: CareerType.CERTIFICATION,
                certificationType: CareerCertificationType.THE_ONE_SITE,
            },
        });

        const contracts = await this.prismaService.contract.findMany({
            where: {
                application: {
                    OR: [
                        {
                            member: {
                                accountId,
                            },
                        },
                        {
                            team: {
                                members: {
                                    some: {
                                        member: {
                                            accountId,
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
                NOT: null,
            },
            select: {
                startDate: true,
                endDate: true,
                application: {
                    select: {
                        post: {
                            select: {
                                company: true,
                                site: true,
                                occupationId: true,
                            },
                        },
                    },
                },
            },
        });
        await this.prismaService.member.update({
            where: {
                accountId,
            },
            data: {
                career: {
                    createMany: {
                        data: contracts.map((value) => {
                            return {
                                companyName: value.application.post.company.name,
                                siteName: value.application.post.site.name,
                                startDate: new Date(value.startDate),
                                endDate: new Date(value.endDate),
                                type: CareerType.CERTIFICATION,
                                certificationType: CareerCertificationType.THE_ONE_SITE,
                                isExperienced: true,
                                occupationId: value.application.post.occupationId,
                            };
                        }),
                    },
                },
            },
        });
    }
}
