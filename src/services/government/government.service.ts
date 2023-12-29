import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CareerType } from '@prisma/client';

@Injectable()
export class GovernmentService {
    constructor(private readonly prismaService: PrismaService) {}

    async saveCertificationExperienceHealthInsurance(memberId: number): Promise<void> {
        await this.prismaService.career.createMany({
            data: [
                {
                    memberId,
                    companyName: 'HealthInsurance - company name 1',
                    siteName: 'HealthInsurance - site name 1',
                    startDate: new Date('2023-06-12').toISOString(),
                    endDate: new Date('2023-12-12').toISOString(),
                    type: CareerType.CERTIFICATION,
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
                    isExperienced: true,
                    occupationId: 1,
                },
            ],
        });
    }

    async saveCertificationExperienceEmploymentInsurance(memberId: number): Promise<void> {
        await this.prismaService.career.createMany({
            data: [
                {
                    memberId,
                    companyName: 'EmploymentInsurance - company name 1',
                    siteName: 'EmploymentInsurance - site name 1',
                    startDate: new Date('2023-06-12').toISOString(),
                    endDate: new Date('2023-12-12').toISOString(),
                    type: CareerType.CERTIFICATION,
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
                    isExperienced: true,
                    occupationId: 1,
                },
            ],
        });
    }

    async saveCertificationTheOneSite(memberId: number): Promise<void> {
        await this.prismaService.career.createMany({
            data: [
                {
                    memberId,
                    companyName: 'TheOneSite - company name 1',
                    siteName: 'TheOneSite - site name 1',
                    startDate: new Date('2023-06-12').toISOString(),
                    endDate: new Date('2023-12-12').toISOString(),
                    type: CareerType.CERTIFICATION,
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
                    isExperienced: true,
                    occupationId: 1,
                },
            ],
        });
    }
}
