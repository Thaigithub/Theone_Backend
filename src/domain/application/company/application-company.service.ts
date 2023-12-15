import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InterviewStatus, PostApplicationStatus, Prisma, SupportCategory } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ApplicationCompanyApplicantsSearch } from './dto/applicants/application-company-applicants-search.enum';
import { ApplicationCompanyGetListApplicantsRequest } from './request/application-company-get-list-applicants.request';
import { ApplicationCompanyGetListApplicantsResponse } from './response/application-company-get-list-applicants.response';

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
            ...(query.applicationDate && { assignedAt: query.applicationDate }),
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
                        region: true,
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

        const applicationListCount = await this.prismaService.application.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(applicationList, new PageInfo(applicationListCount));
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
}
