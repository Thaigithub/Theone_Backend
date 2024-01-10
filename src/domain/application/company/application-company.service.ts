import { Injectable, NotFoundException } from '@nestjs/common';
import { InterviewStatus, PostApplicationStatus, Prisma, SupportCategory } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ApplicationCompanyApplicantsSearch } from './enum/application-company-applicants-search.enum';
import { ApplicationCompanyStatus } from './enum/application-company-update-status.enum';
import { ApplicationCompanyGetListApplicantsRequest } from './request/application-company-get-list-applicants.request';
import { ApplicationCompanyUpdateStatusRequest } from './request/application-company-update-status.request';
import { ApplicationCompanyCountApplicationsResponse } from './response/application-company-count-applicants.response';
import { ApplicationCompanyGetListApplicantsResponse } from './response/application-company-get-list-for post.response';
import { ApplicationCompanyGetListOfferByPost } from './response/application-company-get-list-offer-for-post.response';
import { ApplicationCompanyGetMemberDetail } from './response/application-company-get-member-detail.response';
import { ApplicationCompanyGetTeamDetail } from './response/application-company-get-team-detail.response';

@Injectable()
export class ApplicationCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getListForPost(
        accountId: number,
        query: ApplicationCompanyGetListApplicantsRequest,
        postId: number,
    ): Promise<ApplicationCompanyGetListApplicantsResponse> {
        const queryFilter: Prisma.ApplicationWhereInput = {
            post: {
                company: {
                    accountId: accountId,
                },
                id: postId,
            },
            ...(query.startApplicationDate && { assignedAt: { gte: new Date(query.startApplicationDate) } }),
            ...(query.endApplicationDate && { assignedAt: { lte: new Date(query.endApplicationDate) } }),
            ...(query.searchCategory == ApplicationCompanyApplicantsSearch.NAME && {
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
            }),
        };
        const applicationList = await this.prismaService.application.findMany({
            select: {
                id: true,
                assignedAt: true,
                member: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                        totalExperienceMonths: true,
                        totalExperienceYears: true,
                        specialLicenses: {
                            select: {
                                code: {
                                    select: {
                                        codeName: true,
                                    },
                                },
                                licenseNumber: true,
                            },
                        },
                        desiredSalary: true,
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
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        leader: {
                            select: {
                                contact: true,
                                totalExperienceMonths: true,
                                totalExperienceYears: true,
                                desiredSalary: true,
                                specialLicenses: {
                                    select: {
                                        code: {
                                            select: {
                                                codeName: true,
                                            },
                                        },
                                        licenseNumber: true,
                                    },
                                },
                            },
                        },
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
                member: item.member
                    ? {
                          name: item.member.name,
                          contact: item.member.contact,
                          totalExperienceMonths: item.member.totalExperienceYears,
                          totalExperienceYears: item.member.totalExperienceMonths,
                          desiredSalary: item.member.desiredSalary,
                          specialLicenses: item.member.specialLicenses.map((item) => {
                              return {
                                  name: item.code.codeName,
                                  licenseNumber: item.licenseNumber,
                              };
                          }),
                          city: {
                              englishName: item.member.district?.city.englishName || null,
                              koreanName: item.member.district?.city.koreanName || null,
                          },
                          district: {
                              englishName: item.member.district?.englishName || null,
                              koreanName: item.member.district?.koreanName || null,
                          },
                      }
                    : null,
                team: item.team
                    ? {
                          name: item.team.name,
                          city: {
                              englishName: item.team.district?.city.englishName || null,
                              koreanName: item.team.district?.city.koreanName || null,
                          },
                          district: {
                              englishName: item.team.district?.englishName || null,
                              koreanName: item.team.district?.koreanName || null,
                          },
                          leader: {
                              contact: item.team.leader.contact,
                              totalExperienceMonths: item.team.leader.totalExperienceMonths,
                              totalExperienceYears: item.team.leader.totalExperienceMonths,
                              desiredSalary: item.team.leader.desiredSalary,
                              specialLicenses: item.team.leader.specialLicenses.map((item) => {
                                  return {
                                      name: item.code.codeName,
                                      licenseNumber: item.licenseNumber,
                                  };
                              }),
                          },
                      }
                    : null,
            };
        });
        const applicationListCount = await this.prismaService.application.count({
            where: queryFilter,
        });
        return new PaginationResponse(newApplicationList, new PageInfo(applicationListCount));
    }

    async count(accountId: number): Promise<ApplicationCompanyCountApplicationsResponse> {
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
        if (!application) throw new NotFoundException('Application not found');
        if (body.status === ApplicationCompanyStatus.REJECT) {
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
            await this.prismaService.$transaction(async (tx) => {
                await tx.interview.create({
                    data: {
                        interviewStatus: InterviewStatus.INTERVIEWING,
                        supportCategory: SupportCategory.MANPOWER,
                        applicationId,
                    },
                });
            });
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
        }
    }

    async getListOfferForPost(accountId: number, postId: number): Promise<ApplicationCompanyGetListOfferByPost> {
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

    async getMemberDetail(accountId: number, id: number): Promise<ApplicationCompanyGetMemberDetail> {
        const member = await this.prismaService.application.findUnique({
            where: {
                id: id,
                post: {
                    isActive: true,
                    company: {
                        accountId: accountId,
                        isActive: true,
                    },
                },
                member: {
                    isActive: true,
                },
            },
            select: {
                memberId: true,
                status: true,
            },
        });
        if (!member) {
            throw new NotFoundException('The member id is not found');
        }
        const memberInfor = await this.prismaService.member.findUnique({
            where: {
                id: member.memberId,
            },
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
                        occupation: {
                            select: {
                                codeName: true,
                            },
                        },
                        startDate: true,
                        endDate: true,
                    },
                },
                specialLicenses: {
                    select: {
                        id: true,
                        code: {
                            select: {
                                codeName: true,
                            },
                        },
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
                desiredOccupations: {
                    where: {
                        isActive: true,
                    },
                    select: {
                        code: {
                            select: {
                                codeName: true,
                            },
                        },
                    },
                    orderBy: { updatedAt: 'desc' },
                },
            },
        });

        return {
            id: member.memberId,
            name: memberInfor.name,
            username: memberInfor.account.username,
            contact: memberInfor.contact,
            email: memberInfor.email,
            city: memberInfor.district
                ? {
                      englishName: memberInfor.district.city.englishName,
                      koreanName: memberInfor.district.city.koreanName,
                  }
                : null,
            district: memberInfor.district
                ? {
                      englishName: memberInfor.district.englishName,
                      koreanName: memberInfor.district.koreanName,
                  }
                : null,
            desiredSalary: memberInfor.desiredSalary,
            totalExperienceMonths: memberInfor.totalExperienceMonths,
            totalExperienceYears: memberInfor.totalExperienceYears,
            desiredOccupations:
                memberInfor.desiredOccupations.length > 0
                    ? memberInfor.desiredOccupations.map((item) => {
                          return {
                              codeName: item.code.codeName,
                          };
                      })
                    : [],
            careers: memberInfor.career.map((item) => {
                return {
                    startDate: item.startDate,
                    endDate: item.endDate,
                    companyName: item.companyName,
                    siteName: item.siteName,
                    occupation: item.occupation ? item.occupation.codeName : null,
                };
            }),
            specialLicenses: memberInfor.specialLicenses.map((item) => {
                return {
                    id: item.id,
                    codeName: item.code ? item.code.codeName : null,
                    licenseNumber: item.licenseNumber,
                };
            }),
            basicHealthSafetyCertificate: memberInfor.basicHealthSafetyCertificate
                ? {
                      registrationNumber: memberInfor.basicHealthSafetyCertificate.registrationNumber,
                      dateOfCompletion: memberInfor.basicHealthSafetyCertificate.dateOfCompletion,
                      file: {
                          fileName: memberInfor.basicHealthSafetyCertificate.file.fileName,
                          type: memberInfor.basicHealthSafetyCertificate.file.type,
                          key: memberInfor.basicHealthSafetyCertificate.file.key,
                          size: Number(memberInfor.basicHealthSafetyCertificate.file.size),
                      },
                  }
                : null,
            status: member.status,
        };
    }

    async getTeamDetail(accountId: number, id: number): Promise<ApplicationCompanyGetTeamDetail> {
        const team = await this.prismaService.application.findUnique({
            where: {
                id: id,
                post: {
                    isActive: true,
                    company: {
                        accountId: accountId,
                        isActive: true,
                    },
                },
                team: {
                    isActive: true,
                },
            },
            select: {
                teamId: true,
                status: true,
            },
        });
        if (!team) {
            throw new NotFoundException('The application id applying for team is not found');
        }

        const application = await this.prismaService.team.findUnique({
            where: {
                id: team.teamId,
                isActive: true,
            },
            select: {
                name: true,
                totalMembers: true,
                district: {
                    include: {
                        city: true,
                    },
                },
                leader: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                        totalExperienceYears: true,
                        totalExperienceMonths: true,
                        desiredSalary: true,
                        desiredOccupations: {
                            where: {
                                isActive: true,
                            },
                            select: {
                                code: {
                                    select: {
                                        codeName: true,
                                    },
                                },
                            },
                            orderBy: { updatedAt: 'desc' },
                        },
                        career: {
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
                        specialLicenses: {
                            select: {
                                id: true,
                                code: {
                                    select: {
                                        codeName: true,
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
                                desiredOccupations: {
                                    where: {
                                        isActive: true,
                                    },
                                    select: {
                                        code: {
                                            select: {
                                                codeName: true,
                                            },
                                        },
                                    },
                                    orderBy: { updatedAt: 'desc' },
                                },
                                career: {
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
                                specialLicenses: {
                                    select: {
                                        id: true,
                                        code: {
                                            select: {
                                                codeName: true,
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
            throw new NotFoundException('The application applying for team is not exist');
        }

        const { leader, members } = application;

        let specialLicenses = [];
        const memberDetails = [];
        members.forEach((element) => {
            specialLicenses = specialLicenses.concat(
                element.member.specialLicenses.map((license) => {
                    return {
                        id: license.id,
                        codeName: license.code.codeName,
                        licenseNumber: license.licenseNumber,
                    };
                }),
            );
            memberDetails.push({
                id: element.member.id,
                name: element.member.name,
                contact: element.member.contact,
                desiredOccupation:
                    element.member.desiredOccupations.length > 0
                        ? element.member.desiredOccupations.map((item) => {
                              return {
                                  codeName: item.code.codeName,
                              };
                          })
                        : [],
                totalExperienceYears: element.member.totalExperienceYears,
                totalExperienceMonths: element.member.totalExperienceMonths,
            });
        });
        memberDetails.unshift({
            id: leader.id,
            name: leader.name,
            contact: leader.contact,
            desiredOccupation:
                leader.desiredOccupations.length > 0
                    ? leader.desiredOccupations.map((item) => {
                          return {
                              codeName: item.code.codeName,
                          };
                      })
                    : [],
            totalExperienceYears: leader.totalExperienceYears,
            totalExperienceMonths: leader.totalExperienceMonths,
        });
        specialLicenses = specialLicenses.concat(
            leader.specialLicenses.map((license) => {
                return {
                    id: license.id,
                    codeName: license.code?.codeName,
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
                contact: leader.contact,
                totalExperienceYears: leader.totalExperienceYears,
                totalExperienceMonths: leader.totalExperienceMonths,
                desiredSalary: leader.desiredSalary,
            },
            members: memberDetails,
            city: application.district?.city
                ? {
                      englishName: application.district.city.englishName,
                      koreanName: application.district.city.koreanName,
                  }
                : null,
            district: application.district
                ? {
                      englishName: application.district.englishName,
                      koreanName: application.district.koreanName,
                  }
                : null,
            specialLicenses: specialLicenses,
            status: team.status,
        };
    }
}
