import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CareerCertificationType, CareerType } from '@prisma/client';

@Injectable()
export class GovernmentService {
    constructor(private readonly prismaService: PrismaService) {}

    async saveCertificationExperienceHealthInsurance(memberId: number): Promise<void> {
        await this.prismaService.career.deleteMany({
            where: {
                memberId,
                type: CareerType.CERTIFICATION,
                certificationType: CareerCertificationType.HEALTH_INSURANCE,
            },
        });
        await this.prismaService.career.createMany({
            data: [
                {
                    memberId,
                    companyName: 'HealthInsurance - company name 1',
                    siteName: 'HealthInsurance - site name 1',
                    startDate: new Date('2023-06-12').toISOString(),
                    endDate: new Date('2023-12-12').toISOString(),
                    type: CareerType.CERTIFICATION,
                    certificationType: CareerCertificationType.HEALTH_INSURANCE,
                    isExperienced: true,
                    occupationId: 1,
                },
                {
                    memberId,
                    companyName: 'health insurance - company name 2',
                    siteName: 'health insurance - site name 2',
                    startDate: new Date('2023-05-12').toISOString(),
                    endDate: new Date('2023-11-12').toISOString(),
                    type: CareerType.CERTIFICATION,
                    certificationType: CareerCertificationType.HEALTH_INSURANCE,
                    isExperienced: true,
                    occupationId: 1,
                },
            ],
        });
    }

    async saveCertificationExperienceEmploymentInsurance(memberId: number): Promise<void> {
        await this.prismaService.career.deleteMany({
            where: {
                memberId,
                type: CareerType.CERTIFICATION,
                certificationType: CareerCertificationType.EMPLOYMENT_INSURANCE,
            },
        });

        await this.prismaService.career.createMany({
            data: [
                {
                    memberId,
                    companyName: 'EmploymentInsurance - company name 1',
                    siteName: 'EmploymentInsurance - site name 1',
                    startDate: new Date('2023-06-12').toISOString(),
                    endDate: new Date('2023-12-12').toISOString(),
                    type: CareerType.CERTIFICATION,
                    certificationType: CareerCertificationType.EMPLOYMENT_INSURANCE,
                    isExperienced: true,
                    occupationId: 1,
                },
                {
                    memberId,
                    companyName: 'health insurance - company name 2',
                    siteName: 'health insurance - site name 2',
                    startDate: new Date('2023-05-12').toISOString(),
                    endDate: new Date('2023-11-12').toISOString(),
                    type: CareerType.CERTIFICATION,
                    certificationType: CareerCertificationType.EMPLOYMENT_INSURANCE,
                    isExperienced: true,
                    occupationId: 1,
                },
            ],
        });
    }

    async saveCertificationTheOneSite(memberId: number): Promise<void> {
        await this.prismaService.career.deleteMany({
            where: {
                memberId,
                type: CareerType.CERTIFICATION,
                certificationType: CareerCertificationType.THE_ONE_SITE,
            },
        });

        const applications = await this.prismaService.application.findMany({
            where: {
                OR: [
                    {
                        memberId,
                    },
                    {
                        team: {
                            members: {
                                some: {
                                    memberId,
                                },
                            },
                        },
                    },
                ],
            },
        });

        const applicationIds = applications.map((value) => value.id);
        const contracts = await this.prismaService.contract.findMany({
            where: {
                applicationId: {
                    in: applicationIds,
                },
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
                            },
                        },
                    },
                },
            },
        });

        await this.prismaService.career.createMany({
            data: contracts.map((value) => {
                return {
                    memberId,
                    companyName: value.application.post.company.name,
                    siteName: value.application.post.site.name,
                    startDate: new Date(value.startDate).toISOString(),
                    endDate: new Date(value.startDate).toISOString(),
                    type: CareerType.CERTIFICATION,
                    certificationType: CareerCertificationType.THE_ONE_SITE,
                    isExperienced: true,
                    occupationId: 1,
                };
            }),
        });
    }
}
