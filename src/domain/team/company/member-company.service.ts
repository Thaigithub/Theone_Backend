import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { TeamCompanyGetTeamDetailApplicants } from './response/team-company-get-team-detail.response';

@Injectable()
export class CompanyTeamService {
    constructor(private readonly prismaService: PrismaService) {}
    async getTeamDetail(accountId: any, id: number): Promise<TeamCompanyGetTeamDetailApplicants> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        return await this.prismaService.application.findUniqueOrThrow({
            where: {
                id,
                post: {
                    site: {
                        companyId: account.company.id,
                    },
                },
            },
            select: {
                team: {
                    select: {
                        name: true,
                        region: true,
                        leader: {
                            select: {
                                contact: true,
                                totalExperienceYears: true,
                                totalExperienceMonths: true,
                                desiredSalary: true,
                            },
                        },
                        members: {
                            select: {
                                member: {
                                    select: {
                                        name: true,
                                        contact: true,
                                        desiredOccupation: true,
                                        totalExperienceYears: true,
                                        totalExperienceMonths: true,
                                    },
                                },
                            },
                            orderBy: [
                                {
                                    member: {
                                        totalExperienceYears: 'desc',
                                    },
                                },
                                {
                                    member: {
                                        totalExperienceMonths: 'desc',
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        });
    }
}
