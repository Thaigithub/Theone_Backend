import { Injectable } from '@nestjs/common';
import { PostApplicationStatus, Prisma } from '@prisma/client';
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
                site: {
                    companyId: account.company.id,
                },
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
                assignedAt: true,
                post: {
                    select: {
                        id: true,
                        siteContact: true,
                        occupation: {
                            select: {
                                codeName: true,
                            },
                        },
                        specialNote: {
                            select: {
                                codeName: true,
                            },
                        },
                        salaryAmount: true,
                        salaryType: true,
                        siteAddress: true,
                    },
                },
                member: {
                    select: {
                        id: true,
                        name: true,
                        Career: true,
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
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

        await this.prismaService.application.update({
            where: {
                id: applicationId,
                post: {
                    site: {
                        companyId: account.company.id,
                    },
                },
            },
            data: {
                status: status,
            },
        });
    }
}
