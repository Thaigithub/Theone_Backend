import { Injectable } from '@nestjs/common';
import { ApplicationCategory, InterviewStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { MatchingAdminGetListCategory } from './enum/matching-admin-get-list-category.enum';
import { MatchingAdminGetListRequest } from './request/matching-admin-get-list.request';
import { MatchingAdminGetItemResponse, MatchingAdminGetListResponse } from './response/matching-admin-get-list.response';

@Injectable()
export class MatchingAdminService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: MatchingAdminGetListRequest): Promise<MatchingAdminGetListResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            ...(query.startDate && { startDate: { gte: new Date(query.startDate) } }),
            ...(query.endDate && { endDate: { lte: new Date(query.endDate) } }),
            ...(query.keyword && {
                ...(query.category === MatchingAdminGetListCategory.NAME && {
                    company: { name: { contains: query.keyword, mode: 'insensitive' } },
                }),
                ...(query.category === MatchingAdminGetListCategory.CONTACT && {
                    company: { contactPhone: { contains: query.keyword, mode: 'insensitive' } },
                }),
                ...(!query.category && {
                    OR: [
                        {
                            company: { contactPhone: { contains: query.keyword, mode: 'insensitive' } },
                        },
                        { company: { name: { contains: query.keyword, mode: 'insensitive' } } },
                    ],
                }),
            }),
            //TODO: Service Type
        };

        const list = await this.prismaService.post.findMany({
            select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                company: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
                site: {
                    select: {
                        name: true,
                    },
                },
                applications: {
                    select: {
                        category: true,
                        interview: {
                            select: {
                                status: true,
                            },
                        },
                    },
                },
            },
            where: queryFilter,
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const listCount = await this.prismaService.post.count({
            where: queryFilter,
        });

        const listResponse = list.map((item) => {
            const res: MatchingAdminGetItemResponse = {
                companyName: item.company.name,
                companyId: item.company.id,
                siteName: item.site?.name || null,
                postName: item.name,
                startDate: item.startDate,
                endDate: item.endDate,
                paymentDate: null, //TODO: Adjust this field
                remainingNumber: null, // TODO: Adjust this field
                numberOfInterviewRequests: item.applications.filter(
                    (applicant) => applicant.category === ApplicationCategory.MATCHING,
                ).length,
                numberOfInterviewRejections: item.applications.filter(
                    (applicant) =>
                        applicant.category === ApplicationCategory.MATCHING &&
                        applicant.interview?.status === InterviewStatus.FAIL,
                ).length,
            };
            return res;
        });

        return new PaginationResponse(listResponse, new PageInfo(listCount));
    }
}
