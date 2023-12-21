import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InterviewStatus, PostApplicationStatus, Prisma, RequestObject, SupportCategory } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { RecommendationCompanyInterviewProposeRequest } from './request/recommendaation-company-interview-proposed.request';
import { RecommendationCompanyGetListHeadhuntingApprovedRequest } from './request/recommendation-company-get-list-headhunting-approved.request';
import { RecommendationCompanyGetListHeadhuntingApprovedResponse } from './response/recommendation-company-get-list-headhunting-approved.response';

@Injectable()
export class RecommendationCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(
        accountId: number,
        postId: number,
        query: RecommendationCompanyGetListHeadhuntingApprovedRequest,
    ): Promise<RecommendationCompanyGetListHeadhuntingApprovedResponse> {
        const account = await this.prismaService.account.findUniqueOrThrow({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const post = await this.prismaService.post.findUnique({
            where: {
                id: postId,
                isActive: true,
                companyId: account.company.id,
            },
        });

        if (!post) throw new BadRequestException('No post found');

        const queryFilter: Prisma.HeadhuntingRecommendationWhereInput = {
            postId,
            ...(query.name && { OR: [{ member: { name: query.name } }, { team: { name: query.name } }] }),
        };

        const list = await this.prismaService.headhuntingRecommendation.findMany({
            select: {
                member: {
                    select: {
                        name: true,
                        contact: true,
                        totalExperienceMonths: true,
                        totalExperienceYears: true,
                        specialLicenses: true,
                        desiredSalary: true,
                        region: true,
                    },
                },
                team: {
                    select: {
                        name: true,
                        leader: {
                            select: {
                                contact: true,
                                totalExperienceMonths: true,
                                totalExperienceYears: true,
                                specialLicenses: true,
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

        const listCount = await this.prismaService.headhuntingRecommendation.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(list, new PageInfo(listCount));
    }

    async proposeInterview(
        accountId: number,
        applicantId: number,
        headhunting: SupportCategory,
        body: RecommendationCompanyInterviewProposeRequest,
    ) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const post = await this.prismaService.post.findUnique({
            where: {
                id: body.postId,
                isActive: true,
                companyId: account.company.id,
            },
        });

        if (!post) throw new BadRequestException('No Post found');

        if (body.object === RequestObject.INDIVIDUAL) {
            const applicant = await this.prismaService.headhuntingRecommendation.findUnique({
                where: {
                    memberId_postId: {
                        memberId: applicantId,
                        postId: body.postId,
                    },
                },
            });

            if (!applicant) throw new BadRequestException('No applicant found');

            await this.proposeInterviewEachObject('memberId', applicantId, headhunting, body);
        } else {
            const applicant = await this.prismaService.headhuntingRecommendation.findUnique({
                where: {
                    teamId_postId: {
                        teamId: applicantId,
                        postId: body.postId,
                    },
                },
            });

            if (!applicant) throw new BadRequestException('No applicant found');

            await this.proposeInterviewEachObject('teamId', applicantId, headhunting, body);
        }
    }

    async proposeInterviewEachObject(
        object: string,
        applicantId: number,
        supportCategory: SupportCategory,
        body: RecommendationCompanyInterviewProposeRequest,
    ) {
        await this.prismaService.application.create({
            data: {
                [object]: applicantId,
                postId: body.postId,
                status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                interview: {
                    create: {
                        interviewStatus: InterviewStatus.INTERVIEWING,
                        supportCategory: supportCategory,
                    },
                },
            },
        });
    }

    async getDetailApplicants(accountId: number, applicantId: number, body: RecommendationCompanyInterviewProposeRequest) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const post = await this.prismaService.post.findUnique({
            where: {
                id: body.postId,
                isActive: true,
                companyId: account.company.id,
            },
        });

        if (!post) throw new BadRequestException('No Post found');

        if (body.object === RequestObject.INDIVIDUAL) {
            const applicant = await this.prismaService.headhuntingRecommendation.findUnique({
                where: {
                    memberId_postId: {
                        memberId: applicantId,
                        postId: body.postId,
                    },
                },
            });

            if (!applicant) throw new BadRequestException('No applicant found');

            return await this.prismaService.member.findUnique({
                where: {
                    id: applicantId,
                    isActive: true,
                },
                select: {
                    name: true,
                    contact: true,
                    email: true,
                    region: true,
                    longitude: true,
                    latitude: true,
                    desiredSalary: true,
                    totalExperienceYears: true,
                    totalExperienceMonths: true,
                    account: {
                        select: {
                            username: true,
                        },
                    },
                    Career: {
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
            });
        } else {
            const applicant = await this.prismaService.headhuntingRecommendation.findUnique({
                where: {
                    teamId_postId: {
                        teamId: applicantId,
                        postId: body.postId,
                    },
                },
            });

            if (!applicant) throw new BadRequestException('No applicant found');

            return await this.prismaService.team.findUnique({
                where: {
                    id: applicantId,
                    isActive: true,
                },
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
            });
        }
    }
}
