import { Injectable, NotFoundException } from '@nestjs/common';
import { CodeType, PostHistoryType, PostType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostAdminApplicationSearchCategoryFilter } from './enum/post-admin-application-search-category-filter.enum';
import { PostAdminApplicationSortCategory } from './enum/post-admin-application-sort-category.enum';
import { PostAdminApplicationStatusFilter } from './enum/post-admin-application-status-filter.enum';
import { PostAdminPostStatusFilter } from './enum/post-admin-post-status-filter.enum';
import { PostAdminSearchCategoryFilter } from './enum/post-admin-search-category-filter.enum';
import { PostAdminDeleteRequest } from './request/post-admin-delete.request';
import { PostAdminGetListForApplicationRequest } from './request/post-admin-get-list-application.request';
import { PostAdminGetListRequest } from './request/post-admin-get-list.request';
import { PostAdminUpdateExposureRequest } from './request/post-admin-update-exposure.request';
import { PostAdminUpdatePullupRequest } from './request/post-admin-update-pullup.request';
import { PostAdminUpdateTypeRequest } from './request/post-admin-update-type.request';
import { PostAdminUpdateRequest } from './request/post-admin-update.request';
import { PostAdminGetDetailResponse } from './response/post-admin-get-detail.response';
import { PostAdminGetListForApplicationResponse } from './response/post-admin-get-list-application.response';
import { PostAdminGetListResponse } from './response/post-admin-get-list.response';

@Injectable()
export class PostAdminService {
    constructor(private prismaService: PrismaService) {}

    async checkExistPost(id: number) {
        const post_record = await this.prismaService.post.findUnique({
            where: {
                id: id,
                isActive: true,
            },
        });
        if (!post_record) {
            throw new NotFoundException('The Post id is not found');
        }
        return post_record;
    }

    async checkCodeType(id: number, codeType: CodeType) {
        if (id) {
            const code = await this.prismaService.code.findUnique({
                where: {
                    isActive: true,
                    id,
                    codeType: codeType,
                },
            });
            if (!code) throw new NotFoundException(`Code ID of type ${codeType} does not exist`);
        }
    }

    async getList(query: PostAdminGetListRequest): Promise<PostAdminGetListResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            ...(query.type && { type: PostType[query.type] }),
            ...(query.status == PostAdminPostStatusFilter.CLOSED && { status: 'DEADLINE' }),
            ...(query.status == PostAdminPostStatusFilter.HIDDEN && { isHidden: true }),
            ...(query.status == PostAdminPostStatusFilter.STOPPED && { isActive: false }),
            isActive: true,
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
                site: { name: { contains: query.searchTerm, mode: 'insensitive' } },
            }),
            ...(query.searchCategory == PostAdminSearchCategoryFilter.REPRESENTATIVE_NAME && {
                site: { personInCharge: { contains: query.searchTerm, mode: 'insensitive' } },
            }),
            ...(query.searchCategory == PostAdminSearchCategoryFilter.SITE_CONTACT_INFO && {
                site: { contact: { contains: query.searchTerm, mode: 'insensitive' } },
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
                status: true,
                isPulledUp: true,
                isHidden: true,
            },
            where: queryFilter,
            orderBy: [
                {
                    type: 'desc',
                },
                {
                    createdAt: 'desc',
                },
            ],
            ...QueryPagingHelper.queryPaging(query),
        });
        const postListCount = await this.prismaService.post.count({
            where: queryFilter,
        });
        return new PaginationResponse(postList, new PageInfo(postListCount));
    }

    async getListForApplication(query: PostAdminGetListForApplicationRequest): Promise<PostAdminGetListForApplicationResponse> {
        /*
        This function use for search & filtering the post list based on screen "Support Management"
        */
        const queryFilter: Prisma.PostWhereInput = {
            ...(query.status == PostAdminApplicationStatusFilter.STOPPED && { isActive: false }),
            ...(query.status == PostAdminApplicationStatusFilter.HIDDEN && { isHidden: true }),
            ...(query.status == PostAdminApplicationStatusFilter.CLOSED && { status: 'DEADLINE' }),
            isActive: true,
            ...(query.status == PostAdminApplicationStatusFilter.IN_PROGRESS
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
            ...(query.searchCategory == PostAdminApplicationSearchCategoryFilter.ANNOUNCEMENT_NAME && {
                name: { contains: query.searchTerm, mode: 'insensitive' },
            }),
            ...(query.searchCategory == PostAdminApplicationSearchCategoryFilter.SITE_NAME && {
                site: { name: { contains: query.searchTerm, mode: 'insensitive' } },
            }),
        };
        const sortStrategy: Prisma.PostOrderByWithRelationInput = {
            ...(query.sortByApplication == PostAdminApplicationSortCategory.HIGHEST_APPLICATION && {
                applicants: {
                    _count: 'desc',
                },
            }),
            ...(query.sortByApplication == PostAdminApplicationSortCategory.LOWEST_APPLICATION && {
                applicants: {
                    _count: 'asc',
                },
            }),
            ...(query.sortByApplication == PostAdminApplicationSortCategory.MOST_RECENT && { startDate: 'desc' }),
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
        const postList = tempList.map((application) => ({
            ...application,
            countApplication: application.applicants.length,
            applicants: undefined, // Remove the 'applicants' attribute if desired
        }));
        const applicationListCount = await this.prismaService.post.count({
            where: queryFilter,
        });
        return new PaginationResponse(postList, new PageInfo(applicationListCount));
    }

    async getDetail(id: number): Promise<PostAdminGetDetailResponse> {
        const infor = await this.prismaService.post.findUnique({
            where: {
                id,
                isActive: true,
            },
            include: {
                specialOccupation: {
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
                        district: {
                            select: {
                                englishName: true,
                                koreanName: true,
                                city: true,
                            },
                        },
                    },
                },
            },
        });
        if (!infor) {
            throw new NotFoundException(`The Post Id does not exist`);
        }
        return infor;
    }

    async recordPostHistory(postId: number, historyType: PostHistoryType, data: any, content: string | undefined) {
        await this.prismaService.post.update({
            where: {
                id: postId,
                isActive: true,
            },
            data: {
                ...data,
                postHistory: {
                    create: {
                        content: content,
                        historyType: historyType,
                    },
                },
            },
        });
        return true;
    }

    async update(id: number, request: PostAdminUpdateRequest) {
        await this.checkCodeType(request.specialNoteId, CodeType.SPECIAL);
        await this.checkCodeType(request.occupationId, CodeType.GENERAL);
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = request.startWorkTime ? FAKE_STAMP + request.startWorkTime + 'Z' : undefined;
        request.endWorkTime = request.endWorkTime ? FAKE_STAMP + request.endWorkTime + 'Z' : undefined;
        await this.checkExistPost(id);
        const data = {
            type: request.type,
            category: request.category,
            status: request.status,
            name: request.name,
            startDate: request.startDate && new Date(request.startDate),
            endDate: request.endDate && new Date(request.endDate),
            experienceType: request.experienceType,
            numberOfPeople: request.numberOfPeople,
            specialOccupationId: request.specialNoteId || null,
            occupationId: request.occupationId || null,
            otherInformation: request.otherInformation,
            salaryType: request.salaryType,
            salaryAmount: request.salaryAmount,
            startWorkDate: request.startWorkDate && new Date(request.startWorkDate),
            endWorkDate: request.endWorkDate && new Date(request.endWorkDate),
            workday: request.workday,
            startWorkTime: request.startWorkTime,
            endWorkTime: request.endWorkTime,
            postEditor: request.postEditor,
        };
        await this.recordPostHistory(id, PostHistoryType.EDITED, data, request.updateReason);
    }

    async deletePost(id: number, query: PostAdminDeleteRequest) {
        await this.checkExistPost(id);
        const data = {
            isActive: false,
        };
        await this.recordPostHistory(id, PostHistoryType.DELETED, data, query.deleteReason);
    }

    async updateExposure(id: number, payload: PostAdminUpdateExposureRequest) {
        const post_record = await this.checkExistPost(id);
        if (post_record.isHidden != payload.isHidden) {
            await this.prismaService.post.update({
                where: {
                    id: id,
                    isActive: true,
                },
                data: {
                    isHidden: payload.isHidden,
                },
            });
        }
    }

    async updatePullup(payload: PostAdminUpdatePullupRequest) {
        await this.prismaService.post.updateMany({
            where: {
                id: {
                    in: payload.ids,
                },
                isActive: true,
            },
            data: {
                isPulledUp: payload.isPulledUp,
            },
        });
    }

    async updatePostType(payload: PostAdminUpdateTypeRequest) {
        await this.prismaService.post.updateMany({
            where: {
                id: {
                    in: payload.ids,
                },
                isActive: true,
            },
            data: {
                type: payload.type,
            },
        });
    }
}
