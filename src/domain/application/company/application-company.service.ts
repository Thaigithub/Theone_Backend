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
}
