import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import {
    ApplicationAdminSearchCategoryFilter,
    ApplicationAdminSortFilter,
    ApplicationAdminStatusFilter,
} from './dto/application-admin-filter';
import { ApplicationAdminGetListRequest } from './request/application-admin-get-list.request';
import { ApplicationAdminGetListResponse } from './response/application-admin-get-list.response';

@Injectable()
export class ApplicationAdminService {
    constructor(private prismaService: PrismaService) {}
    async getList(query: ApplicationAdminGetListRequest): Promise<ApplicationAdminGetListResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            ...(query.status == ApplicationAdminStatusFilter.STOPPED && { isActive: false }),
            ...(query.status == ApplicationAdminStatusFilter.HIDDEN && { isHidden: true }),
            ...(query.status == ApplicationAdminStatusFilter.CLOSED && { status: 'DEADLINE' }),
            ...(query.status == ApplicationAdminStatusFilter.IN_PROGRESS
                ? {
                      OR: [{ status: 'RECRUITING' }, { status: 'PREPARE' }],
                  }
                : {}),
            ...(!query.searchCategory && query.searchTerm
                ? {
                      OR: [
                          { name: { contains: query.searchTerm, mode: 'insensitive' } },
                          { site: { name: { contains: query.searchTerm, mode: 'insensitive' } } },
                      ],
                  }
                : {}),
            ...(query.searchCategory == ApplicationAdminSearchCategoryFilter.ANNOUNCEMENT_NAME && {
                name: { contains: query.searchTerm, mode: 'insensitive' },
            }),
            ...(query.searchCategory == ApplicationAdminSearchCategoryFilter.SITE_NAME && {
                siteName: { contains: query.searchTerm, mode: 'insensitive' },
            }),
        };
        const sortStrategy: Prisma.PostOrderByWithRelationInput = {
            ...(query.sortByApplication == ApplicationAdminSortFilter.HIGHEST_APPLICATION && {
                applicants: {
                    _count: 'desc',
                },
            }),
            ...(query.sortByApplication == ApplicationAdminSortFilter.LOWEST_APPLICATION && {
                applicants: {
                    _count: 'asc',
                },
            }),
            ...(query.sortByApplication == ApplicationAdminSortFilter.MOST_RECENT && { startDate: 'desc' }),
        };
        const tempList = await this.prismaService.post.findMany({
            select: {
                id: true,
                name: true,
                applicants: true,
                startDate: true,
                status: true,
                site: {
                    select: {
                        name: true,
                    },
                },
            },
            where: queryFilter,
            orderBy: sortStrategy,
            ...QueryPagingHelper.queryPaging(query),
        });
        const applicationList = tempList.map((application) => ({
            ...application,
            countApplication: application.applicants.length,
            applicants: undefined, // Remove the 'applicants' attribute if desired
        }));
        const applicationListCount = await this.prismaService.post.count({
            where: queryFilter,
        });
        return new PaginationResponse(applicationList, new PageInfo(applicationListCount));
    }
}
