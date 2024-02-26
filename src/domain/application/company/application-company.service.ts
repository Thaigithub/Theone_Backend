import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationCategory, InterviewStatus, PostApplicationStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ApplicationCompanyUpdateStatus } from './enum/application-company-update-status.enum';
import { ApplicationCompanyGetListPostRequest } from './request/application-company-get-list-post.request';
import { ApplicationCompanyUpdateStatusRequest } from './request/application-company-update-status.request';
import { ApplicationCompanyGetDetailMemberResponse } from './response/application-company-get-detail-member.response';
import { ApplicationCompanyGetDetailTeamResponse } from './response/application-company-get-detail-team.response';
import { ApplicationCompanyGetListOfferPost } from './response/application-company-get-list-offer-post.response';
import { ApplicationCompanyGetListPostResponse } from './response/application-company-get-list-post.response';
import { ApplicationCompanyGetTotalResponse } from './response/application-company-get-total.response';

@Injectable()
export class ApplicationCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getListPost(
        accountId: number,
        query: ApplicationCompanyGetListPostRequest,
        postId: number,
    ): Promise<ApplicationCompanyGetListPostResponse> {
        const queryFilter: Prisma.ApplicationWhereInput = {
            post: {
                company: {
                    accountId: accountId,
                },
                id: postId,
            },
            ...(query.startDate && { assignedAt: { gte: new Date(query.startDate) } }),
            ...(query.endDate && { assignedAt: { lte: new Date(query.endDate) } }),
            OR: [
                {
                    member: {
                        name: { contains: query.keyword, mode: 'insensitive' },
                    },
                },
                {
                    team: {
                        name: { contains: query.keyword, mode: 'insensitive' },
                    },
                },
            ],
        };
        const applicationList = await this.prismaService.application.findMany({
            select: {
                id: true,
                assignedAt: true,
                status: true,
                member: {
                    include: {
                        licenses: {
                            where: {
                                isActive: true,
                            },
                            include: {
                                code: true,
                            },
                        },
                        region: true,
                        account: true,
                    },
                },
                team: {
                    include: {
                        leader: {
                            include: {
                                licenses: {
                                    where: {
                                        isActive: true,
                                    },
                                    include: {
                                        code: true,
                                    },
                                },
                            },
                        },
                        region: true,
                    },
                },
            },
            where: queryFilter,
            orderBy: {
                assignedAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const newApplicationList = applicationList.map((item) => {
            return {
                id: item.id,
                assignedAt: item.assignedAt,
                status: item.status,
                member: item.member
                    ? {
                          id: item.member.id,
                          name: item.member.name,
                          contact: item.member.contact,
                          totalExperienceMonths: item.member.totalExperienceYears,
                          totalExperienceYears: item.member.totalExperienceMonths,
                          desiredSalary: item.member.desiredSalary,
                          licenses: item.member.licenses.map((item) => {
                              return {
                                  name: item.code.name,
                                  licenseNumber: item.licenseNumber,
                              };
                          }),
                          city: {
                              englishName: item.member.region?.cityEnglishName || null,
                              koreanName: item.member.region?.cityKoreanName || null,
                          },
                          district: {
                              englishName: item.member.region?.districtEnglishName || null,
                              koreanName: item.member.region?.districtKoreanName || null,
                          },
                          isActive: item.member.account.isActive,
                      }
                    : null,
                team: item.team
                    ? {
                          id: item.team.id,
                          name: item.team.name,
                          city: {
                              englishName: item.team.region?.cityEnglishName || null,
                              koreanName: item.team.region?.cityKoreanName || null,
                          },
                          district: {
                              englishName: item.team.region?.districtEnglishName || null,
                              koreanName: item.team.region?.districtKoreanName || null,
                          },
                          leader: {
                              contact: item.team.leader.contact,
                              totalExperienceMonths: item.team.leader.totalExperienceMonths,
                              totalExperienceYears: item.team.leader.totalExperienceMonths,
                              desiredSalary: item.team.leader.desiredSalary,
                              licenses: item.team.leader.licenses.map((item) => {
                                  return {
                                      name: item.code.name,
                                      licenseNumber: item.licenseNumber,
                                  };
                              }),
                          },
                          isActive: item.team.isActive,
                      }
                    : null,
            };
        });
        const applicationListCount = await this.prismaService.application.count({
            where: queryFilter,
        });
        return new PaginationResponse(newApplicationList, new PageInfo(applicationListCount));
    }

    async count(accountId: number): Promise<ApplicationCompanyGetTotalResponse> {
        const applications = await this.prismaService.application.count({
            where: {
                post: {
                    company: {
                        accountId: accountId,
                    },
                },
            },
        });
        return { countApplications: applications };
    }

    async updateStatus(accountId: number, applicationId: number, body: ApplicationCompanyUpdateStatusRequest) {
        const application = await this.prismaService.application.findUnique({
            where: {
                id: applicationId,
                post: {
                    company: {
                        accountId,
                    },
                },
            },
        });
        if (!application) throw new NotFoundException(Error.APPLICATION_NOT_FOUND);
        if (body.status === ApplicationCompanyUpdateStatus.REJECT) {
            await this.prismaService.application.update({
                where: {
                    id: applicationId,
                    post: {
                        company: {
                            accountId: accountId,
                        },
                    },
                },
                data: {
                    status: PostApplicationStatus.REJECT_BY_COMPANY,
                },
            });
        } else {
            await this.prismaService.application.update({
                where: {
                    id: applicationId,
                    post: {
                        company: {
                            accountId: accountId,
                        },
                    },
                },
                data: {
                    category: ApplicationCategory.MANPOWER,
                    status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                    interview: {
                        create: {
                            status: InterviewStatus.INTERVIEWING,
                        },
                    },
                },
            });
        }
    }

    async getListOfferPost(accountId: number, postId: number): Promise<ApplicationCompanyGetListOfferPost> {
        const offer = (
            await this.prismaService.application.findMany({
                where: {
                    postId,
                    post: {
                        company: {
                            accountId,
                        },
                    },
                    status: PostApplicationStatus.APPROVE_BY_MEMBER,
                },
                select: {
                    id: true,
                    team: {
                        select: {
                            name: true,
                            leader: {
                                select: {
                                    contact: true,
                                },
                            },
                        },
                    },
                    member: {
                        select: {
                            name: true,
                            contact: true,
                        },
                    },
                },
            })
        ).map((item) => {
            return {
                applicationId: item.id,
                type: item.member ? 'INDIVIDUAL' : 'TEAM',
                member: item.member
                    ? {
                          name: item.member.name,
                          contact: item.member.contact,
                      }
                    : null,
                team: item.team
                    ? {
                          name: item.team.name,
                          contact: item.team.leader.contact,
                      }
                    : null,
            };
        });
        return new PaginationResponse(offer, new PageInfo(offer.length));
    }

    async getDetailMember(accountId: number, id: number): Promise<ApplicationCompanyGetDetailMemberResponse> {
        const member = await this.prismaService.application.findUnique({
            where: {
                id: id,
                NOT: { memberId: null },
                post: {
                    company: {
                        accountId: accountId,
                    },
                },
            },
            select: {
                memberId: true,
                status: true,
            },
        });
        if (!member) {
            throw new NotFoundException(Error.MEMBER_NOT_FOUND);
        }
        const memberInfor = await this.prismaService.member.findUnique({
            where: {
                id: member.memberId,
            },
            include: {
                region: true,
                account: true,
                careers: {
                    include: {
                        code: true,
                    },
                },
                licenses: {
                    where: {
                        isActive: true,
                    },
                    include: {
                        code: true,
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
        });

        return {
            id: member.memberId,
            name: memberInfor.name,
            username: memberInfor.account.username,
            contact: memberInfor.contact,
            email: memberInfor.email,
            city: {
                englishName: memberInfor.region?.cityEnglishName || null,
                koreanName: memberInfor.region?.cityKoreanName || null,
            },
            district: {
                englishName: memberInfor.region?.districtEnglishName || null,
                koreanName: memberInfor.region?.districtKoreanName || null,
            },
            desiredSalary: memberInfor.desiredSalary,
            totalExperienceMonths: memberInfor.totalExperienceMonths,
            totalExperienceYears: memberInfor.totalExperienceYears,
            careers: memberInfor.careers.map((item) => {
                return {
                    startDate: item.startDate,
                    endDate: item.endDate,
                    companyName: item.companyName,
                    siteName: item.siteName,
                    occupation: item.code ? item.code.name : null,
                };
            }),
            licenses: memberInfor.licenses.map((item) => {
                return {
                    id: item.id,
                    codeName: item.code ? item.code.name : null,
                    licenseNumber: item.licenseNumber,
                };
            }),
            basicHealthSafetyCertificate: {
                registrationNumber: memberInfor.basicHealthSafetyCertificate
                    ? memberInfor.basicHealthSafetyCertificate.registrationNumber
                    : null,
                dateOfCompletion: memberInfor.basicHealthSafetyCertificate
                    ? memberInfor.basicHealthSafetyCertificate.dateOfCompletion
                    : null,
                file: {
                    fileName: memberInfor.basicHealthSafetyCertificate
                        ? memberInfor.basicHealthSafetyCertificate.file.fileName
                        : null,
                    type: memberInfor.basicHealthSafetyCertificate ? memberInfor.basicHealthSafetyCertificate.file.type : null,
                    key: memberInfor.basicHealthSafetyCertificate ? memberInfor.basicHealthSafetyCertificate.file.key : null,
                    size: memberInfor.basicHealthSafetyCertificate
                        ? Number(memberInfor.basicHealthSafetyCertificate.file.size)
                        : null,
                },
            },
            status: member.status,
        };
    }

    async getDetailTeam(accountId: number, id: number): Promise<ApplicationCompanyGetDetailTeamResponse> {
        const team = await this.prismaService.application.findUnique({
            where: {
                id: id,
                NOT: { teamId: null },
                post: {
                    company: {
                        accountId: accountId,
                    },
                },
            },
            select: {
                teamId: true,
                status: true,
            },
        });
        if (!team) {
            throw new NotFoundException(Error.APPLICATION_NOT_FOUND);
        }

        const application = await this.prismaService.team.findUnique({
            where: {
                id: team.teamId,
            },
            select: {
                teamCode: true,
                name: true,
                totalMembers: true,
                region: true,
                leader: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                        totalExperienceYears: true,
                        totalExperienceMonths: true,
                        desiredSalary: true,
                        careers: {
                            where: {
                                isActive: true,
                            },
                            select: {
                                startDate: true,
                                endDate: true,
                            },
                            take: 1,
                            orderBy: { updatedAt: 'desc' },
                        },
                        licenses: {
                            where: {
                                isActive: true,
                            },
                            select: {
                                id: true,
                                code: {
                                    select: {
                                        name: true,
                                    },
                                },
                                licenseNumber: true,
                            },
                        },
                    },
                },
                members: {
                    where: {
                        isActive: true,
                        member: {
                            isActive: true,
                        },
                    },
                    select: {
                        member: {
                            select: {
                                id: true,
                                name: true,
                                contact: true,
                                desiredSalary: true,
                                careers: {
                                    where: {
                                        isActive: true,
                                    },
                                    select: {
                                        experiencedYears: true,
                                        experiencedMonths: true,
                                    },
                                    orderBy: { updatedAt: 'desc' },
                                },
                                totalExperienceYears: true,
                                totalExperienceMonths: true,
                                licenses: {
                                    where: {
                                        isActive: true,
                                    },
                                    select: {
                                        id: true,
                                        code: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                        licenseNumber: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!application) {
            throw new NotFoundException(Error.APPLICATION_NOT_FOUND);
        }

        const { leader, members } = application;

        let licenses = [];
        const memberDetails = [];
        members.forEach((element) => {
            licenses = licenses.concat(
                element.member.licenses.map((license) => {
                    return {
                        id: license.id,
                        codeName: license.code.name,
                        licenseNumber: license.licenseNumber,
                    };
                }),
            );
            memberDetails.push({
                id: element.member.id,
                name: element.member.name,
                contact: element.member.contact,
                totalExperienceYears: element.member.totalExperienceYears,
                totalExperienceMonths: element.member.totalExperienceMonths,
            });
        });
        memberDetails.unshift({
            id: leader.id,
            name: leader.name,
            contact: leader.contact,
            totalExperienceYears: leader.totalExperienceYears,
            totalExperienceMonths: leader.totalExperienceMonths,
        });
        licenses = licenses.concat(
            leader.licenses.map((license) => {
                return {
                    id: license.id,
                    codeName: license.code?.name,
                    licenseNumber: license.licenseNumber,
                };
            }),
        );

        return {
            name: application.name,
            totalMembers: application.totalMembers,
            contact: application.leader.contact,
            leader: {
                id: leader.id,
                name: leader.name,
                contact: leader.contact,
                totalExperienceYears: leader.totalExperienceYears,
                totalExperienceMonths: leader.totalExperienceMonths,
                desiredSalary: leader.desiredSalary,
                occupations: leader.licenses.map((item) => item.code.name),
            },
            members: memberDetails,
            city: {
                englishName: application.region?.cityEnglishName || null,
                koreanName: application.region?.cityKoreanName || null,
            },
            district: {
                englishName: application.region?.districtEnglishName || null,
                koreanName: application.region?.districtKoreanName || null,
            },
            code: application.teamCode,
            licenses: licenses,
            status: team.status,
        };
    }

    async getDetailTeamMember(accountId: number, memberId: number): Promise<ApplicationCompanyGetDetailMemberResponse> {
        const member = await this.prismaService.application.findFirst({
            where: {
                team: {
                    OR: [
                        {
                            members: {
                                some: {
                                    memberId: memberId,
                                },
                            },
                        },
                        {
                            leaderId: memberId,
                        },
                    ],
                },
                post: {
                    company: {
                        accountId: accountId,
                        isActive: true,
                    },
                },
            },
            select: {
                memberId: true,
                status: true,
            },
        });
        if (!member) {
            throw new NotFoundException(Error.MEMBER_NOT_FOUND);
        }
        const memberInfor = await this.prismaService.member.findUnique({
            where: {
                id: memberId,
            },
            include: {
                region: true,
                account: true,
                careers: {
                    include: {
                        code: true,
                    },
                },
                licenses: {
                    where: {
                        isActive: true,
                    },
                    include: {
                        code: true,
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
        });

        return {
            id: member.memberId,
            name: memberInfor.name,
            username: memberInfor.account.username,
            contact: memberInfor.contact,
            email: memberInfor.email,
            city: {
                englishName: memberInfor.region?.cityEnglishName || null,
                koreanName: memberInfor.region?.cityKoreanName || null,
            },
            district: {
                englishName: memberInfor.region?.districtEnglishName || null,
                koreanName: memberInfor.region?.districtKoreanName || null,
            },
            desiredSalary: memberInfor.desiredSalary,
            totalExperienceMonths: memberInfor.totalExperienceMonths,
            totalExperienceYears: memberInfor.totalExperienceYears,
            careers: memberInfor.careers.map((item) => {
                return {
                    startDate: item.startDate,
                    endDate: item.endDate,
                    companyName: item.companyName,
                    siteName: item.siteName,
                    occupation: item.code ? item.code.name : null,
                };
            }),
            licenses: memberInfor.licenses.map((item) => {
                return {
                    id: item.id,
                    codeName: item.code ? item.code.name : null,
                    licenseNumber: item.licenseNumber,
                };
            }),
            basicHealthSafetyCertificate: {
                registrationNumber: memberInfor.basicHealthSafetyCertificate
                    ? memberInfor.basicHealthSafetyCertificate.registrationNumber
                    : null,
                dateOfCompletion: memberInfor.basicHealthSafetyCertificate
                    ? memberInfor.basicHealthSafetyCertificate.dateOfCompletion
                    : null,
                file: {
                    fileName: memberInfor.basicHealthSafetyCertificate
                        ? memberInfor.basicHealthSafetyCertificate.file.fileName
                        : null,
                    type: memberInfor.basicHealthSafetyCertificate ? memberInfor.basicHealthSafetyCertificate.file.type : null,
                    key: memberInfor.basicHealthSafetyCertificate ? memberInfor.basicHealthSafetyCertificate.file.key : null,
                    size: memberInfor.basicHealthSafetyCertificate
                        ? Number(memberInfor.basicHealthSafetyCertificate.file.size)
                        : null,
                },
            },
            status: member.status,
        };
    }
}
