import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CodeType, PostHistoryType, PostType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import {
    ApplicationAdminSearchCategoryFilter,
    ApplicationAdminSortFilter,
    ApplicationAdminStatusFilter,
    PostAdminPostStatusFilter,
    PostAdminSearchCategoryFilter,
} from './dto/post-admin-filter';
import { PostAdminDeleteRequest } from './request/post-admin-delete.request';
import { ApplicationAdminGetListRequest, PostAdminGetListRequest } from './request/post-admin-get-list.request';
import {
    PostAdminModifyHiddenRequest,
    PostAdminModifyPostTypeRequest,
    PostAdminModifyPullUpRequest,
    PostAdminModifyRequest,
} from './request/post-admin-modify-request';
import { PostAdminDetailResponse } from './response/post-admin-detail.response';
import { ApplicationAdminGetListResponse, PostAdminGetListResponse } from './response/post-admin-get-list.response';

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

    async checkExistPosts(ids: number[]) {
        if (ids.length === 0) {
            throw new BadRequestException('The Post ids is empty');
        }
        const existingPosts = await this.prismaService.post.findMany({
            where: {
                id: {
                    in: ids,
                },
                isActive: true,
            },
        });
        const existingIds = existingPosts.map((post) => post.id);
        const nonExistingIds = ids.filter((id) => !existingIds.includes(id));
        if (nonExistingIds.length > 0) {
            throw new NotFoundException(`The Post ids: ${nonExistingIds} are not found`);
        }
    }

    async checkExistSite(id: number) {
        const site_record = await this.prismaService.site.findUnique({
            where: {
                id: id,
                isActive: true,
            },
        });
        if (!site_record) {
            throw new NotFoundException('The site id is not found');
        }
        return site_record;
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

    async getPostApplicationList(query: ApplicationAdminGetListRequest): Promise<ApplicationAdminGetListResponse> {
        /*
        This function use for search & filtering the post list based on screen "Support Management"
        */
        const queryFilter: Prisma.PostWhereInput = {
            ...(query.status == ApplicationAdminStatusFilter.STOPPED && { isActive: false }),
            ...(query.status == ApplicationAdminStatusFilter.HIDDEN && { isHidden: true }),
            ...(query.status == ApplicationAdminStatusFilter.CLOSED && { status: 'DEADLINE' }),
            isActive: true,
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
                site: { name: { contains: query.searchTerm, mode: 'insensitive' } },
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

    async getPostDetails(id: number): Promise<PostAdminDetailResponse> {
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
                    },
                },
            },
        });
        if (!infor) {
            throw new NotFoundException(`The Post Id does not exist`);
        }
        return infor;
    }

    async updatePost(postId: number, historyType: PostHistoryType, data: any, content: string) {
        const postHistory = await this.prismaService.postHistory.create({
            data: {
                postId: postId,
                content: content,
                historyType: historyType,
            },
        });
        await this.prismaService.post.update({
            where: {
                id: postId,
                isActive: true,
            },
            data: {
                ...data,
                postHistory: {
                    connect: { id: postHistory.id },
                },
                updatedAt: new Date(),
            },
        });
        return true;
    }

    async changePostInfo(id: number, request: PostAdminModifyRequest) {
        await this.checkCodeType(request.specialNoteId, CodeType.SPECIAL);
        await this.checkCodeType(request.occupationId, CodeType.GENERAL);

        //Modified Time to timestampz
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = request.startWorkTime ? FAKE_STAMP + request.startWorkTime + 'Z' : undefined;
        request.endWorkTime = request.endWorkTime ? FAKE_STAMP + request.endWorkTime + 'Z' : undefined;
        await this.checkExistPost(id);
        if (request.siteId) {
            await this.checkExistSite(request.siteId);
        }
        const data = {
            updatedAt: new Date(),
            type: request.type,
            category: request.category,
            status: request.status,
            name: request.name,
            workLocation: request.workLocation,
            startDate: request.startDate,
            endDate: request.endDate,
            experienceType: request.experienceType,
            numberOfPeople: request.numberOfPeople,
            specialNoteId: request.specialNoteId || null,
            occupationId: request.occupationId || null,
            otherInformation: request.otherInformation,
            salaryType: request.salaryType,
            salaryAmount: request.salaryAmount,
            startWorkDate: request.startWorkDate && new Date(request.startWorkDate),
            endWorkDate: request.endWorkDate && new Date(request.endWorkDate),
            workday: request.workday,
            startWorkTime: request.startWorkTime,
            endWorkTime: request.endWorkTime,
            siteId: request.siteId,
            postEditor: request.postEditor,
        };
        await this.prismaService.$transaction(async () => {
            await this.updatePost(id, PostHistoryType.EDITED, data, request.updateReason);
            const updatedPostRecord = await this.checkExistPost(id);
            await this.prismaService.site.update({
                where: {
                    id: updatedPostRecord.siteId,
                    isActive: true,
                },
                data: {
                    name: request.siteName,
                    address: request.siteAddress,
                    contact: request.siteContact,
                    personInCharge: request.sitePersonInCharge,
                    originalBuilding: request.originalBuilding,
                    updatedAt: new Date(),
                },
            });
        });
    }

    async deletePost(id: number, query: PostAdminDeleteRequest) {
        await this.checkExistPost(id);
        const data = {
            isActive: false,
        };
        await this.updatePost(id, PostHistoryType.DELETED, data, query.deleteReason);
    }
    async changeHiddenStatus(id: number, payload: PostAdminModifyHiddenRequest) {
        const post_record = await this.checkExistPost(id);
        if (post_record.isHidden != payload.isHidden) {
            await this.prismaService.post.update({
                where: {
                    id: id,
                    isActive: true,
                },
                data: {
                    isHidden: payload.isHidden,
                    updatedAt: new Date(),
                },
            });
        }
    }

    async changePullUp(payload: PostAdminModifyPullUpRequest) {
        await this.prismaService.post.updateMany({
            where: {
                id: {
                    in: payload.ids,
                },
                isActive: true,
            },
            data: {
                isPulledUp: payload.isPulledUp,
                updatedAt: new Date(),
            },
        });
    }

    async changePostType(payload: PostAdminModifyPostTypeRequest) {
        await this.prismaService.post.updateMany({
            where: {
                id: {
                    in: payload.ids,
                },
                isActive: true,
            },
            data: {
                type: payload.type,
                updatedAt: new Date(),
            },
        });
    }
}
