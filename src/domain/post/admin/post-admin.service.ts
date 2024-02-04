/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType, PostHistoryType, PostType, Prisma } from '@prisma/client';
import { NotificationCompanyService } from 'domain/notification/company/notification-company.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { CountResponse } from 'utils/generics/count.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostAdminApplicationSearchCategoryFilter } from './enum/post-admin-application-search-category-filter.enum';
import { PostAdminApplicationSortCategory } from './enum/post-admin-application-sort-category.enum';
import { PostAdminApplicationStatusFilter } from './enum/post-admin-application-status-filter.enum';
import { PostAdminCountCategory } from './enum/post-admin-count-category.enum';
import { PostAdminPostStatusFilter } from './enum/post-admin-post-status-filter.enum';
import { PostAdminSearchCategoryFilter } from './enum/post-admin-search-category-filter.enum';
import { PostAdminDeleteRequest } from './request/post-admin-delete.request';
import { PostAdminGetCountRequest } from './request/post-admin-get-count.request';
import { PostAdminGetListForApplicationRequest } from './request/post-admin-get-list-application.request';
import { PostAdminGetListRequest } from './request/post-admin-get-list.request';
import { PostAdminUpdateExposureRequest } from './request/post-admin-update-exposure.request';
import { PostAdminUpdatePullupRequest } from './request/post-admin-update-pullup.request';
import { PostAdminUpdateTypeRequest } from './request/post-admin-update-type.request';
import { PostAdminUpdateRequest } from './request/post-admin-update.request';
import { PostAdminGetDetailResponse } from './response/post-admin-get-detail.response';
import { PostAdminGetListForApplicationResponse } from './response/post-admin-get-list-application.response';
import { PostAdminGetListResponse } from './response/post-admin-get-list.response';
import { Error } from 'utils/error.enum';

@Injectable()
export class PostAdminService {
    constructor(
        private prismaService: PrismaService,
        private notificationCompanyService: NotificationCompanyService
    ) {}

    async checkExistPost(id: number) {
        const post_record = await this.prismaService.post.findUnique({
            where: {
                id: id,
                isActive: true,
            },
        });
        if (!post_record) {
            throw new NotFoundException(Error.POST_NOT_FOUND);
        }
        return post_record;
    }

    async checkCodeType(id: number) {
        if (id) {
            const code = await this.prismaService.code.findUnique({
                where: {
                    isActive: true,
                    id,
                },
            });
            if (!code) throw new NotFoundException(Error.OCCUPATION_NOT_FOUND);
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
                applications: true,
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
            countApplication: application.applications.length,
            applicants: undefined, // Remove the 'applicants' attribute if desired
        }));
        const applicationListCount = await this.prismaService.post.count({
            where: queryFilter,
        });
        return new PaginationResponse(postList, new PageInfo(applicationListCount));
    }

    async getDetail(id: number): Promise<PostAdminGetDetailResponse> {
        const item = await this.prismaService.post.findUnique({
            where: {
                id,
                isActive: true,
            },
            include: {
                code: {
                    select: {
                        code: true,
                        name: true,
                    },
                },
                site: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                        address: true,
                        originalBuilding: true,
                        personInCharge: true,
                        region: {
                            select: {
                                cityKoreanName: true,
                                cityEnglishName: true,
                                districtEnglishName: true,
                                districtKoreanName: true,
                            },
                        },
                    },
                },
            },
        });

        const post = {
            siteId: item.site?.id ||null,
            category: item.category,
            type: item.type,
            name: item.name,
            startDate: item.startDate,
            endDate: item.endDate,
            experienceType: item.experienceType,
            numberOfPeople: item.numberOfPeoples,
            occupation: item.code
                ? {
                      codeName: item.code.name,
                      code: item.code.code,
                  }
                : null,
            salaryType: item.salaryType,
            salaryAmount: item.salaryAmount,
            status: item.status,
            startWorkDate: item.startWorkDate,
            endWorkDate: item.endWorkDate,
            workday: item.workdays,
            startWorkTime: item.startWorkTime,
            endWorkTime: item.endWorkTime,
            postEditor: item.postEditor,
            site: {
                name: item.site.name,
                contact: item.site.contact,
                personInCharge: item.site.personInCharge,
                originalBuilding: item.site.originalBuilding,
                address: item.site.address,
                district: {
                    englishName: item.site.region.districtEnglishName,
                    koreanName: item.site.region.districtKoreanName,
                    city: {
                        englishName: item.site.region.cityEnglishName,
                        koreanName: item.site.region.cityKoreanName,
                    },
                },
            },
        };
        if (!post) {
            throw new NotFoundException(Error.POST_NOT_FOUND);
        }
        return post;
    }

    async getCount(query: PostAdminGetCountRequest): Promise<CountResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            ...(query.category === PostAdminCountCategory.PREMIUM && {
                type: PostType.PREMIUM,
            }),
            ...(query.category === PostAdminCountCategory.GENERAL && {
                type: PostType.COMMON,
            }),
            ...(query.category === PostAdminCountCategory.CLOSED && {
                endDate: { lt: new Date() },
            }),
        };
        const count = await this.prismaService.post.count({
            where: queryFilter,
        });
        return {
            count: count,
        };
    }

    async update(id: number, request: PostAdminUpdateRequest) {
        await this.checkCodeType(request.occupationId);
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = request.startWorkTime ? FAKE_STAMP + request.startWorkTime + 'Z' : undefined;
        request.endWorkTime = request.endWorkTime ? FAKE_STAMP + request.endWorkTime + 'Z' : undefined;
        await this.checkExistPost(id);
        await this.prismaService.post.update({
            where: {
                id: id,
                isActive: true,
            },
            data: {
                type: request.type,
                category: request.category,
                status: request.status,
                name: request.name,
                startDate: request.startDate && new Date(request.startDate),
                endDate: request.endDate && new Date(request.endDate),
                experienceType: request.experienceType,
                numberOfPeoples: request.numberOfPeople,
                ...(request.occupationId && { codeId:  request.occupationId}),
                otherInformation: request.otherInformation,
                salaryType: request.salaryType,
                salaryAmount: request.salaryAmount,
                startWorkDate: request.startWorkDate && new Date(request.startWorkDate),
                endWorkDate: request.endWorkDate && new Date(request.endWorkDate),
                workdays: request.workday,
                startWorkTime: request.startWorkTime,
                endWorkTime: request.endWorkTime,
                postEditor: request.postEditor,
                postHistories: {
                create: {
                        content: request.updateReason,
                        historyType: PostHistoryType.EDITED,
                    },
                },
            },
        });
    }

    async deletePost(id: number, query: PostAdminDeleteRequest) {
        await this.checkExistPost(id);
        const post = await this.prismaService.post.update({
            where: {
                id: id,
                isActive: true,
            },
            data: {
                isActive: false,
                postHistories: {
                    create: {
                        content: query.deleteReason,
                        historyType: PostHistoryType.DELETED,
                    },
                },
            },
            select: {
                company: {
                    select: {
                        accountId: true,
                    }
                }
            }
        });
        await this.notificationCompanyService.create(post.company.accountId, '공고가 반려되었습니다', '', NotificationType.POST, id);
    }

    async updateExposure(id: number, payload: PostAdminUpdateExposureRequest) {
        const post_record = await this.checkExistPost(id);
        if (post_record.isHidden !== payload.isHidden) {
            const post = await this.prismaService.post.update({
                where: {
                    id: id,
                    isActive: true,
                },
                data: {
                    isHidden: payload.isHidden,
                },
                select: {
                    company: {
                        select: {
                            accountId: true,
                        }
                    }
                }
            });
            if(payload.isHidden === true) {
                await this.notificationCompanyService.create(post.company.accountId, '공고가 반려되었습니다', '', NotificationType.POST, id);
            } else {
                await this.notificationCompanyService.create(post.company.accountId, '공고가 처리되었습니다', '', NotificationType.POST, id);
            }
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
