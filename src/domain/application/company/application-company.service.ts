import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InterviewStatus, PostApplicationStatus, Prisma, SupportCategory } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ApplicationCompanyApplicantsSearch } from './dto/applicants/application-company-applicants-search.enum';
import { ApplicationCompanyGetListApplicantsRequest } from './request/application-company-get-list-applicants.request';
import { ApplicationCompanyGetListApplicantsResponse } from './response/application-company-get-list-applicants.response';
import { ApplicationCompanyGetListOfferByPost } from './response/application-company-get-list-offer-by-post.response';

@Injectable()
export class ApplicationCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getListApplicant(
        accountId: number,
        query: ApplicationCompanyGetListApplicantsRequest,
        postId: number,
    ): Promise<ApplicationCompanyGetListApplicantsResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const queryFilter: Prisma.ApplicationWhereInput = {
            post: {
                companyId: account.company.id,
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
                        specialLicenses: true,
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
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const newApplicationList = applicationList.map((item) => {
            const district = item.member.district;
            delete item.member.district;
            return {
                ...item,
                member: {
                    ...item.member,
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
        });

        const applicationListCount = await this.prismaService.application.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(newApplicationList, new PageInfo(applicationListCount));
    }

    async updateApplicationStatus(accountId: any, applicationId: number, status: PostApplicationStatus) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        try {
            await this.prismaService.application.update({
                where: {
                    id: applicationId,
                    post: {
                        companyId: account.company.id,
                    },
                },
                data: {
                    status: status,
                },
            });
        } catch (error) {
            throw new BadRequestException('No application found');
        }
    }

    async proposeInterview(accountId: any, applicationId: number, supportCategory: SupportCategory) {
        const account = await this.prismaService.account.findUniqueOrThrow({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const application = await this.prismaService.application.findUnique({
            where: {
                id: applicationId,
                post: {
                    companyId: account.company.id,
                },
            },
        });

        if (!application) throw new BadRequestException('No application found');

        try {
            await this.prismaService.$transaction(async (tx) => {
                await tx.interview.create({
                    data: {
                        interviewStatus: InterviewStatus.INTERVIEWING,
                        supportCategory: supportCategory,
                        applicationId,
                    },
                });

                await this.updateApplicationStatus(accountId, applicationId, PostApplicationStatus.PROPOSAL_INTERVIEW);
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async getListOfferByPost(accountId, postId): Promise<ApplicationCompanyGetListOfferByPost> {
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
