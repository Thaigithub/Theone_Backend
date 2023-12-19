import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PostType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostAdminPostStatusFilter, PostAdminSearchCategoryFilter } from './dto/post-admin-filter';
import { PostAdminGetListRequest } from './request/post-admin-get-list.request';
import { PostAdminGetListResponse } from './response/post-admin-get-list.response';
import { PostAdminDeleteRequest } from './request/post-admin-delete.request';
import { PostAdminDetailResponse } from './response/post-admin-detail.response';

@Injectable()
export class PostAdminService {
    constructor(private prismaService: PrismaService) {}
    async getList(query: PostAdminGetListRequest): Promise<PostAdminGetListResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            ...(query.type && { type: PostType[query.type] }),
            ...(query.status == PostAdminPostStatusFilter.CLOSED && { status: 'DEADLINE' }),
            ...(query.status == PostAdminPostStatusFilter.HIDDEN && { isHidden: true }),
            ...(query.status == PostAdminPostStatusFilter.STOPPED && { isActive: false }),
            ...(!query.searchCategory && query.searchTerm
                ? {
                      OR: [
                          { name: { contains: query.searchTerm, mode: 'insensitive' } },
                          { site: { name: { contains: query.searchTerm, mode: 'insensitive' } } },
                          { site: { personInCharge: { contains: query.searchTerm, mode: 'insensitive' } } },
                          { site: { contact: { contains: query.searchTerm, mode: 'insensitive' } } },
                      ],
                  }
                : {}),
            ...(query.searchCategory == PostAdminSearchCategoryFilter.ANNOUNCEMENT_NAME && {
                name: { contains: query.searchTerm, mode: 'insensitive' },
            }),
            ...(query.searchCategory == PostAdminSearchCategoryFilter.SITE_NAME && {
                siteName: { contains: query.searchTerm, mode: 'insensitive' },
            }),
            ...(query.searchCategory == PostAdminSearchCategoryFilter.REPRESENTATIVE_NAME && {
                sitePersonInCharge: { contains: query.searchTerm, mode: 'insensitive' },
            }),
            ...(query.searchCategory == PostAdminSearchCategoryFilter.SITE_CONTACT_INFO && {
                siteContact: { contains: query.searchTerm, mode: 'insensitive' },
            }),
            startDate: { gte: query.startDate ? new Date(query.startDate).toISOString() : undefined },
            endDate: { lte: query.endDate ? new Date(query.endDate).toISOString() : undefined },
        };
        const postList = await this.prismaService.post.findMany({
            select: {
                id: true,
                type: true,
                name: true,
                site: {
                    select: {
                        name: true,
                        contact: true,
                        address: true,
                        originalBuilding: true,
                        personInCharge: true,
                    },
                },
                isHidden: true,
            },
            where: queryFilter,
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const postListCount = await this.prismaService.post.count({
            where: queryFilter,
        });
        return new PaginationResponse(postList, new PageInfo(postListCount));
    }

    async getPostDetails(id: number): Promise<PostAdminDetailResponse> {
        const infor = await this.prismaService.post.findUnique({
            where: {
                id,
                isActive: true,
            },
            include: {
                specialNote: {
                    select: {
                        code: true,
                        codeName: true,
                        codeType: true,
                    },
                },
                occupation: {
                    select: {
                        code: true,
                        codeName: true,
                        codeType: true,
                    },
                },
                site: {
                    select: {
                        name: true,
                        contact: true,
                        address: true,
                        originalBuilding: true,
                        personInCharge: true,
                    },
                },
            },
        });
        if (!infor) {
            throw new NotFoundException(`The Post Id does not exist`);
        }
        return infor;
    }

    async deletePost(id: number, query: PostAdminDeleteRequest) {
        try {
            await this.prismaService.post.update({
                where: {
                    id,
                    isActive: true,
                },
                data: {
                    isActive: false,
                    deleteReason: query.deleteReason,
                },
            });
        } catch (err) {
            throw new HttpException('The Post Id with positive status not found!', HttpStatus.NOT_FOUND);
        }
    }
}
