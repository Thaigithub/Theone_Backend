import { Injectable } from '@nestjs/common';
import { ApplicationCompanyGetMemberDetail } from 'domain/application/company/response/application-company-get-member-detail.response';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class MemberCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getMemberDetail(accountId: number, id: number): Promise<ApplicationCompanyGetMemberDetail> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const application = await this.prismaService.application.findUniqueOrThrow({
            where: {
                id,
                post: {
                    companyId: account.company.id,
                },
            },
            select: {
                member: {
                    select: {
                        name: true,
                        contact: true,
                        email: true,
                        district: {
                            select: {
                                englishName: true,
                                koreanName: true,
                                city: {
                                    select: {
                                        englishName: true,
                                        koreanName: true,
                                    },
                                },
                            },
                        },
                        desiredSalary: true,
                        totalExperienceYears: true,
                        totalExperienceMonths: true,
                        account: {
                            select: {
                                username: true,
                            },
                        },
                        career: {
                            select: {
                                companyName: true,
                                siteName: true,
                                occupation: true,
                                startDate: true,
                                endDate: true,
                                experiencedYears: true,
                                experiencedMonths: true,
                            },
                        },
                        certificates: {
                            select: {
                                name: true,
                                certificateNumber: true,
                            },
                        },
                        specialLicenses: {
                            select: {
                                name: true,
                                licenseNumber: true,
                            },
                        },
                        basicHealthSafetyCertificate: {
                            select: {
                                registrationNumber: true,
                                dateOfCompletion: true,
                                file: true,
                            },
                        },
                    },
                },
                interview: {
                    select: {
                        interviewStatus: true,
                    },
                },
            },
        });
        const district = application.member.district;
        delete application.member.district;

        return {
            ...application,
            member: {
                ...application.member,
                city: {
                    englishName: district.city.englishName,
                    koreanName: district.city.koreanName,
                },
                district: {
                    englishName: district.englishName,
                    koreanName: district.koreanName,
                },
            },
        };
    }
}
