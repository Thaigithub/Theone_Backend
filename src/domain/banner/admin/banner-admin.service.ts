import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BannerType, Prisma, RequestBannerStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { BannerAdminAdvertisingSearchCategory } from './enum/banner-admin-advertisng-search-category.enum';
import { BannerAdminPostSearchCategory } from './enum/banner-admin-post-search-category.enum';
import { BannerAdminChangeStatusRequestBannerRequest } from './request/banner-admin-change-status-request-banner.request';
import { BannerAdminGetListAdvertisingRequestRequest } from './request/banner-admin-get-list-advertising-request.request';
import { BannerAdminGetListAdvertisingRequest } from './request/banner-admin-get-list-advertising.request';
import { BannerAdminGetListPostRequestRequest } from './request/banner-admin-get-list-post-request.request';
import { BannerAdminGetListPostRequest } from './request/banner-admin-get-list-post.request';
import { BannerAdminUpdatePriority } from './request/banner-admin-update-priority.request';
import { BannerAdminUpsertAdvertisingRequest } from './request/banner-admin-upsert-advertising.request';
import { BannerAdminUpsertPostRequest } from './request/banner-admin-upsert-post.request';
import { BannerAdminGetDetailAdvertisingRequestResponse } from './response/banner-admin-get-detail-advertising-request.response';
import { BannerAdminGetDetailAdvertisingResponse } from './response/banner-admin-get-detail-advertising.response';
import { BannerAdminGetDetailPostRequestResponse } from './response/banner-admin-get-detail-post-request.response';
import { BannerAdminGetDetailPostResponse } from './response/banner-admin-get-detail-post.response';
import { BannerAdminGetListAdvertisingRequestResponse } from './response/banner-admin-get-list-advertising-request.response';
import { BannerAdminGetListAdvertisingResponse } from './response/banner-admin-get-list-advertising.response';
import { BannerAdminGetListPostRequestResponse } from './response/banner-admin-get-list-post-request.response';
import { BannerAdminGetListPostResponse } from './response/banner-admin-get-list-post.response';

@Injectable()
export class BannerAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    async createAdvertising(request: BannerAdminUpsertAdvertisingRequest): Promise<void> {
        const count = await this.prismaService.advertisingBanner.count({
            where: {
                banner: {
                    isActive: true,
                },
                NOT: {
                    priority: null,
                },
            },
        });
        await this.prismaService.banner.create({
            data: {
                startDate: new Date(request.startDate),
                endDate: new Date(request.endDate),
                status: request.status,
                file: {
                    create: request.file,
                },
                advertisingBanner: {
                    create: {
                        urlLink: request.advertisingBanner.urlLink,
                        title: request.advertisingBanner.title,
                        type: BannerType.ADMIN,
                        priority: count + 1,
                    },
                },
            },
        });
    }

    async getListAdvertising(query: BannerAdminGetListAdvertisingRequest): Promise<BannerAdminGetListAdvertisingResponse> {
        const search = {
            where: {
                banner: {
                    isActive: true,
                    status: query.status,
                    startDate: query.startDate && new Date(query.startDate),
                    endDate: query.endDate && new Date(query.endDate),
                },
                title:
                    query.category &&
                    (query.category === BannerAdminAdvertisingSearchCategory.TITLE
                        ? {
                              contains: query.keyword,
                              mode: Prisma.QueryMode.insensitive,
                          }
                        : undefined),
                urlLink:
                    query.category &&
                    (query.category === BannerAdminAdvertisingSearchCategory.URL
                        ? {
                              contains: query.keyword,
                              mode: Prisma.QueryMode.insensitive,
                          }
                        : undefined),
                OR: [
                    {
                        type: BannerType.ADMIN,
                    },
                    {
                        type: BannerType.COMPANY,
                        request: {
                            status: RequestBannerStatus.APPROVED,
                        },
                    },
                ],
            },
            ...QueryPagingHelper.queryPaging(query),
            select: {
                banner: {
                    select: {
                        status: true,
                        file: true,
                        startDate: true,
                        endDate: true,
                        createdAt: true,
                    },
                },
                id: true,
                title: true,
                urlLink: true,
                priority: true,
            },
            orderBy: {
                priority: Prisma.SortOrder.asc,
            },
        };
        const banners = (await this.prismaService.advertisingBanner.findMany(search)).map((item) => {
            return {
                id: item.id,
                file: {
                    fileName: item.banner.file.fileName,
                    type: item.banner.file.type,
                    key: item.banner.file.key,
                    size: Number(item.banner.file.size),
                },
                title: item.title,
                urlLink: item.urlLink,
                startDate: item.banner.startDate,
                endDate: item.banner.endDate,
                createDate: item.banner.createdAt,
                status: item.banner.status,
                priority: item.priority,
            };
        });
        const total = await this.prismaService.advertisingBanner.count({ where: search.where });
        return new PaginationResponse(banners, new PageInfo(total));
    }

    async getListAdvertisingRequest(
        query: BannerAdminGetListAdvertisingRequestRequest,
    ): Promise<BannerAdminGetListAdvertisingRequestResponse> {
        const querySearch = {
            where: {
                banner: {
                    isActive: true,
                    createdAt: query.requestDate && new Date(query.requestDate),
                },
                title:
                    query.category &&
                    (query.category === BannerAdminAdvertisingSearchCategory.TITLE
                        ? {
                              contains: query.keyword,
                              mode: Prisma.QueryMode.insensitive,
                          }
                        : undefined),
                urlLink:
                    query.category &&
                    (query.category === BannerAdminAdvertisingSearchCategory.URL
                        ? {
                              contains: query.keyword,
                              mode: Prisma.QueryMode.insensitive,
                          }
                        : undefined),
                type: BannerType.COMPANY,
                request: {
                    isActive: true,
                    company: {
                        name:
                            query.category &&
                            (query.category === BannerAdminAdvertisingSearchCategory.COMPANY
                                ? {
                                      contains: query.keyword,
                                      mode: Prisma.QueryMode.insensitive,
                                  }
                                : undefined),
                    },
                },
            },
            ...QueryPagingHelper.queryPaging(query),
            select: {
                banner: {
                    select: {
                        file: true,
                    },
                },
                request: {
                    select: {
                        acceptDate: true,
                        id: true,
                        requestDate: true,
                        status: true,
                    },
                },
                title: true,
            },
            orderBy: {
                banner: {
                    createdAt: Prisma.SortOrder.desc,
                },
            },
        };

        const search = (await this.prismaService.advertisingBanner.findMany(querySearch)).map((item) => {
            return {
                id: item.request.id,
                title: item.title,
                file: {
                    key: item.banner.file.key,
                    fileName: item.banner.file.fileName,
                    size: Number(item.banner.file.size),
                    type: item.banner.file.type,
                },
                requestDate: item.request.requestDate,
                acceptDate: item.request.acceptDate,
                status: item.request.status,
            };
        });
        const total = await this.prismaService.advertisingBanner.count({ where: querySearch.where });
        return new PaginationResponse(search, new PageInfo(total));
    }

    async updateAdvertisingPriority(body: BannerAdminUpdatePriority): Promise<void> {
        const priority = (
            await this.prismaService.advertisingBanner.findMany({
                where: {
                    id: {
                        in: body.data.map((item) => item.id),
                    },
                },
                select: {
                    priority: true,
                },
            })
        ).map((item) => item.priority);
        const check = body.data.filter((item) => {
            return !priority.includes(item.priority);
        });
        if (check.length !== 0) throw new BadRequestException('Banners priority changes is not fully listed');
        await Promise.all(
            body.data.map(async (item) => {
                await this.prismaService.advertisingBanner.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        priority: item.priority,
                    },
                });
            }),
        );
    }

    async getDetailAdvertising(id: number): Promise<BannerAdminGetDetailAdvertisingResponse> {
        const banner = await this.prismaService.advertisingBanner.findUnique({
            where: {
                id,
                banner: { isActive: true },
                OR: [
                    {
                        type: BannerType.ADMIN,
                    },
                    {
                        type: BannerType.COMPANY,
                        request: {
                            status: RequestBannerStatus.APPROVED,
                        },
                    },
                ],
            },
            select: {
                urlLink: true,
                title: true,
                banner: {
                    select: {
                        startDate: true,
                        endDate: true,
                        status: true,
                        file: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!banner) throw new NotFoundException('Banner not found');
        return {
            file: {
                key: banner.banner.file.key,
                fileName: banner.banner.file.fileName,
                type: banner.banner.file.type,
                size: Number(banner.banner.file.size),
            },
            status: banner.banner.status,
            advertisingBanner: {
                title: banner.title,
                urlLink: banner.urlLink,
            },
            startDate: banner.banner.startDate,
            endDate: banner.banner.endDate,
            createdDate: banner.banner.createdAt,
        };
    }

    async updateAdvertising(id: number, request: BannerAdminUpsertAdvertisingRequest): Promise<void> {
        const count = await this.prismaService.advertisingBanner.count({
            where: {
                id,
                banner: { isActive: true },
                OR: [
                    {
                        type: BannerType.ADMIN,
                    },
                    {
                        type: BannerType.COMPANY,
                        request: {
                            status: RequestBannerStatus.APPROVED,
                        },
                    },
                ],
            },
        });
        if (count === 0) throw new NotFoundException('Banner not found');
        await this.prismaService.banner.update({
            where: {
                id,
            },
            data: {
                startDate: new Date(request.startDate),
                endDate: new Date(request.endDate),
                status: request.status,
                file: {
                    update: request.file,
                },
                advertisingBanner: {
                    update: {
                        urlLink: request.advertisingBanner.urlLink,
                        title: request.advertisingBanner.title,
                        priority: count + 1,
                    },
                },
            },
        });
    }

    async getDetailAdvertisingRequest(id: number): Promise<BannerAdminGetDetailAdvertisingRequestResponse> {
        const count = await this.prismaService.bannerRequest.count({
            where: {
                id,
                advertisingBanner: {
                    type: BannerType.COMPANY,
                    request: {
                        isActive: true,
                    },
                },
            },
        });
        if (count === 0) throw new NotFoundException('Banner request not found');
        const banner = await this.prismaService.bannerRequest.findUnique({
            where: { id },
            select: {
                advertisingBanner: {
                    select: {
                        request: {
                            select: {
                                company: {
                                    select: {
                                        name: true,
                                        contactName: true,
                                    },
                                },
                                status: true,
                                acceptDate: true,
                                detail: true,
                            },
                        },
                        title: true,
                        urlLink: true,
                        banner: {
                            select: {
                                file: true,
                                startDate: true,
                                endDate: true,
                                status: true,
                                createdAt: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            request: {
                companyName: banner.advertisingBanner.request.company.name,
                contactName: banner.advertisingBanner.request.company.contactName,
                status: banner.advertisingBanner.request.status,
                acceptDate: banner.advertisingBanner.request.acceptDate,
                detail: banner.advertisingBanner.request.detail,
            },
            advertisingBanner: {
                title: banner.advertisingBanner.title,
                urlLink: banner.advertisingBanner.urlLink,
            },
            file: {
                fileName: banner.advertisingBanner.banner.file.fileName,
                type: banner.advertisingBanner.banner.file.type,
                size: Number(banner.advertisingBanner.banner.file.size),
                key: banner.advertisingBanner.banner.file.key,
            },
            status: banner.advertisingBanner.banner.status,
            startDate: banner.advertisingBanner.banner.startDate,
            endDate: banner.advertisingBanner.banner.endDate,
            createdDate: banner.advertisingBanner.banner.createdAt,
        };
    }

    async createPost(request: BannerAdminUpsertPostRequest): Promise<void> {
        const post = await this.prismaService.post.findUnique({ where: { id: request.postBanner.postId } });
        if (!post) throw new NotFoundException('Post not found');
        const count = await this.prismaService.postBanner.count({
            where: {
                banner: {
                    isActive: true,
                },
                NOT: {
                    priority: null,
                },
            },
        });
        await this.prismaService.banner.create({
            data: {
                status: request.status,
                file: {
                    create: request.file,
                },
                endDate: new Date(request.endDate),
                startDate: new Date(request.startDate),
                postBanner: {
                    create: {
                        postId: request.postBanner.postId,
                        priority: count + 1,
                        type: BannerType.ADMIN,
                    },
                },
            },
        });
    }

    async getListPost(query: BannerAdminGetListPostRequest): Promise<BannerAdminGetListPostResponse> {
        const search = {
            where: {
                banner: {
                    isActive: true,
                    status: query.status,
                    startDate: query.startDate && new Date(query.startDate),
                    endDate: query.endDate && new Date(query.endDate),
                },
                post: {
                    name:
                        query.category &&
                        (query.category === BannerAdminAdvertisingSearchCategory.TITLE
                            ? {
                                  contains: query.keyword,
                                  mode: Prisma.QueryMode.insensitive,
                              }
                            : undefined),
                },
                OR: [
                    {
                        type: BannerType.ADMIN,
                    },
                    {
                        type: BannerType.COMPANY,
                        request: {
                            status: RequestBannerStatus.APPROVED,
                        },
                    },
                ],
            },
            ...QueryPagingHelper.queryPaging(query),
            select: {
                id: true,
                priority: true,
                postId: true,
                post: {
                    select: {
                        name: true,
                    },
                },
                banner: {
                    select: {
                        startDate: true,
                        endDate: true,
                        status: true,
                        file: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                priority: Prisma.SortOrder.asc,
            },
        };
        const result = (await this.prismaService.postBanner.findMany(search)).map((item) => {
            return {
                id: item.id,
                postName: item.post.name,
                file: {
                    key: item.banner.file.key,
                    fileName: item.banner.file.fileName,
                    size: Number(item.banner.file.size),
                    type: item.banner.file.type,
                },
                status: item.banner.status,
                startDate: item.banner.startDate,
                endDate: item.banner.endDate,
                regDate: item.banner.createdAt,
                priority: item.priority,
            };
        });
        const total = await this.prismaService.postBanner.count({ where: search.where });
        return new PaginationResponse(result, new PageInfo(total));
    }

    async getListPostRequest(query: BannerAdminGetListPostRequestRequest): Promise<BannerAdminGetListPostRequestResponse> {
        const querySearch = {
            ...QueryPagingHelper.queryPaging(query),
            where: {
                banner: {
                    isActive: true,
                    createdAt: query.requestDate && new Date(query.requestDate),
                },
                type: BannerType.COMPANY,
                post: {
                    name:
                        query.category &&
                        (query.category === BannerAdminPostSearchCategory.POST
                            ? {
                                  contains: query.keyword,
                                  mode: Prisma.QueryMode.insensitive,
                              }
                            : undefined),
                    site: {
                        name:
                            query.category &&
                            (query.category === BannerAdminPostSearchCategory.SITE
                                ? {
                                      contains: query.keyword,
                                      mode: Prisma.QueryMode.insensitive,
                                  }
                                : undefined),
                    },
                },
                request: {
                    isActive: true,
                    company: {
                        name:
                            query.category &&
                            (query.category === BannerAdminPostSearchCategory.COMPANY
                                ? {
                                      contains: query.keyword,
                                      mode: Prisma.QueryMode.insensitive,
                                  }
                                : undefined),
                    },
                },
            },
            select: {
                request: {
                    select: {
                        id: true,
                        requestDate: true,
                        status: true,
                        acceptDate: true,
                    },
                },
                post: {
                    select: {
                        name: true,
                    },
                },
                banner: {
                    select: {
                        file: true,
                    },
                },
            },
        };
        const search = (await this.prismaService.postBanner.findMany(querySearch)).map((item) => {
            return {
                id: item.request.id,
                postName: item.post.name,
                file: {
                    key: item.banner.file.key,
                    fileName: item.banner.file.fileName,
                    size: Number(item.banner.file.size),
                    type: item.banner.file.type,
                },
                requestDate: item.request.requestDate,
                status: item.request.status,
                acceptDate: item.request.acceptDate,
            };
        });
        const total = await this.prismaService.postBanner.count({ where: querySearch.where });
        return new PaginationResponse(search, new PageInfo(total));
    }

    async updatePostPriority(body: BannerAdminUpdatePriority): Promise<void> {
        const priority = (
            await this.prismaService.postBanner.findMany({
                where: {
                    id: {
                        in: body.data.map((item) => item.id),
                    },
                },
                select: {
                    priority: true,
                },
            })
        ).map((item) => item.priority);
        const check = body.data.filter((item) => {
            return !priority.includes(item.priority);
        });
        if (check.length !== 0) throw new BadRequestException('Banners priority changes is not fully listed');
        await Promise.all(
            body.data.map(async (item) => {
                await this.prismaService.postBanner.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        priority: item.priority,
                    },
                });
            }),
        );
    }

    async getDetailPost(id: number): Promise<BannerAdminGetDetailPostResponse> {
        const count = await this.prismaService.postBanner.count({
            where: {
                id,
                banner: { isActive: true },
                OR: [
                    {
                        type: BannerType.ADMIN,
                    },
                    {
                        type: BannerType.COMPANY,
                        request: {
                            status: RequestBannerStatus.APPROVED,
                        },
                    },
                ],
            },
        });
        if (count === 0) throw new NotFoundException('Banner not found');
        const banner = await this.prismaService.postBanner.findUnique({
            where: { id },
            select: {
                post: {
                    select: {
                        name: true,
                        site: true,
                        id: true,
                    },
                },
                postId: true,
                banner: {
                    select: {
                        file: {
                            select: {
                                key: true,
                                fileName: true,
                                type: true,
                                size: true,
                            },
                        },
                        status: true,
                        startDate: true,
                        endDate: true,
                        createdAt: true,
                    },
                },
            },
        });
        return {
            postBanner: {
                postName: banner.post.name,
                siteName: banner.post.site?.name || null,
                postId: banner.post.id,
            },
            file: {
                fileName: banner.banner.file.fileName,
                type: banner.banner.file.type,
                key: banner.banner.file.key,
                size: Number(banner.banner.file.size),
            },
            status: banner.banner.status,
            startDate: banner.banner.startDate,
            endDate: banner.banner.endDate,
            createdDate: banner.banner.createdAt,
        };
    }

    async updatePost(id: number, request: BannerAdminUpsertPostRequest) {
        const count = await this.prismaService.postBanner.count({
            where: {
                id,
                banner: { isActive: true },
                OR: [
                    {
                        type: BannerType.ADMIN,
                    },
                    {
                        type: BannerType.COMPANY,
                        request: {
                            status: RequestBannerStatus.APPROVED,
                        },
                    },
                ],
            },
        });
        if (count === 0) throw new NotFoundException('Banner not found');
        await this.prismaService.banner.update({
            where: { id },
            data: {
                startDate: new Date(request.startDate),
                endDate: new Date(request.endDate),
                status: request.status,
                file: {
                    update: request.file,
                },
                postBanner: {
                    update: {
                        postId: request.postBanner.postId,
                        priority: count + 1,
                    },
                },
            },
        });
    }

    async getDetailPostRequest(id: number): Promise<BannerAdminGetDetailPostRequestResponse> {
        const count = await this.prismaService.bannerRequest.count({
            where: {
                id,
                postBanner: {
                    type: BannerType.COMPANY,
                    request: {
                        isActive: true,
                    },
                },
            },
        });
        if (count === 0) throw new NotFoundException('Banner request not found');
        const banner = await this.prismaService.bannerRequest.findUnique({
            where: { id },
            select: {
                postBanner: {
                    select: {
                        request: {
                            select: {
                                company: {
                                    select: {
                                        name: true,
                                        contactName: true,
                                    },
                                },
                                status: true,
                                acceptDate: true,
                                detail: true,
                            },
                        },
                        post: {
                            select: {
                                name: true,
                                site: {
                                    select: {
                                        name: true,
                                    },
                                },
                                id: true,
                            },
                        },
                        banner: {
                            select: {
                                file: true,
                                startDate: true,
                                endDate: true,
                                status: true,
                                createdAt: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            request: {
                companyName: banner.postBanner.request.company.name,
                contactName: banner.postBanner.request.company.contactName,
                status: banner.postBanner.request.status,
                acceptDate: banner.postBanner.request.acceptDate,
                detail: banner.postBanner.request.detail,
            },
            postBanner: {
                postName: banner.postBanner.post.name,
                siteName: banner.postBanner.post.site?.name || null,
                postId: banner.postBanner.post.id,
            },
            file: {
                fileName: banner.postBanner.banner.file.fileName,
                type: banner.postBanner.banner.file.type,
                key: banner.postBanner.banner.file.key,
                size: Number(banner.postBanner.banner.file.size),
            },
            status: banner.postBanner.banner.status,
            startDate: banner.postBanner.banner.startDate,
            endDate: banner.postBanner.banner.endDate,
            createdDate: banner.postBanner.banner.createdAt,
        };
    }

    async deleteBanner(id: number): Promise<void> {
        const banner = await this.prismaService.banner.findUnique({
            where: {
                id: id,
                isActive: true,
                OR: [
                    {
                        advertisingBanner: {
                            OR: [
                                {
                                    type: BannerType.ADMIN,
                                    request: null,
                                },
                                {
                                    type: BannerType.COMPANY,
                                    request: { status: RequestBannerStatus.APPROVED },
                                },
                            ],
                        },
                        postBanner: null,
                    },
                    {
                        postBanner: {
                            OR: [
                                {
                                    type: BannerType.ADMIN,
                                    request: null,
                                },
                                {
                                    type: BannerType.COMPANY,
                                    request: { status: RequestBannerStatus.APPROVED },
                                },
                            ],
                        },
                        advertisingBanner: null,
                    },
                ],
            },
            select: {
                advertisingBanner: {
                    select: {
                        priority: true,
                    },
                },
                postBanner: {
                    select: {
                        priority: true,
                    },
                },
            },
        });
        if (!banner) throw new NotFoundException('Banner not found');
        if (banner.advertisingBanner) {
            await this.prismaService.$transaction(async (prisma) => {
                await prisma.advertisingBanner.update({
                    where: {
                        id,
                    },
                    data: {
                        priority: null,
                        banner: {
                            update: {
                                isActive: false,
                            },
                        },
                    },
                });
                const list = await prisma.advertisingBanner.findMany({
                    where: {
                        priority: {
                            gt: banner.advertisingBanner.priority,
                            not: null,
                        },
                    },
                    select: {
                        id: true,
                        priority: true,
                    },
                });
                await Promise.all(
                    list.map(async (item) => {
                        await prisma.advertisingBanner.update({
                            where: {
                                id: item.id,
                            },
                            data: {
                                priority: item.priority - 1,
                            },
                        });
                    }),
                );
            });
        }
        if (banner.postBanner) {
            await this.prismaService.$transaction(async (prisma) => {
                await prisma.postBanner.update({
                    where: {
                        id,
                    },
                    data: {
                        priority: null,
                        banner: {
                            update: {
                                isActive: false,
                            },
                        },
                    },
                });
                const list = await prisma.postBanner.findMany({
                    where: {
                        priority: {
                            gt: banner.postBanner.priority,
                            not: null,
                        },
                    },
                    select: {
                        id: true,
                        priority: true,
                    },
                });
                await Promise.all(
                    list.map(async (item) => {
                        await prisma.postBanner.update({
                            where: {
                                id: item.id,
                            },
                            data: {
                                priority: item.priority - 1,
                            },
                        });
                    }),
                );
            });
        }
    }

    async changeRequestStatus(
        isAdvertising: boolean,
        id: number,
        body: BannerAdminChangeStatusRequestBannerRequest,
    ): Promise<void> {
        const request = await this.prismaService.bannerRequest.findUnique({
            where: {
                id,
                postBanner: !isAdvertising ? { type: BannerType.COMPANY } : undefined,
                advertisingBanner: isAdvertising ? { type: BannerType.COMPANY } : undefined,
            },
        });
        if (!request) throw new NotFoundException('Banner request Id not found');
        if (request.status !== RequestBannerStatus.PENDING) throw new BadRequestException('Banner has been approved or rejected');
        if (!isAdvertising) {
            const count = await this.prismaService.postBanner.count({
                where: {
                    priority: {
                        not: null,
                    },
                },
            });
            await this.prismaService.bannerRequest.update({
                where: {
                    id: id,
                },
                data: {
                    status: body.status,
                    acceptDate: body.status === RequestBannerStatus.APPROVED ? new Date() : undefined,
                    requestBannerHistories: {
                        create: {
                            reason: body.reason,
                            status: body.status,
                        },
                    },
                    postBanner: {
                        update: {
                            priority: count + 1,
                        },
                    },
                },
            });
        } else {
            const count = await this.prismaService.advertisingBanner.count({
                where: {
                    priority: {
                        not: null,
                    },
                },
            });
            await this.prismaService.bannerRequest.update({
                where: {
                    id: id,
                },
                data: {
                    status: body.status,
                    acceptDate: body.status === RequestBannerStatus.APPROVED ? new Date() : undefined,
                    requestBannerHistories: {
                        create: {
                            reason: body.reason,
                            status: body.status,
                        },
                    },
                    advertisingBanner: {
                        update: {
                            priority: count + 1,
                        },
                    },
                },
            });
        }
    }
}
