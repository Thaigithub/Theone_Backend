import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BannerType, Prisma, RequestBannerStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { BannerAdminAdvertisingSearchCategory } from './enum/banner-admin-advertisng-search-category.enum';
import { BannerAdminChangeStatusRequestBannerRequest } from './request/banner-admin-change-status-request-banner.request';
import { BannerAdminGetListAdvertisingRequestRequest } from './request/banner-admin-get-list-advertising-request.request';
import { BannerAdminGetListAdvertisingRequest } from './request/banner-admin-get-list-advertising.request';
import { BannerAdminGetListPostRequest } from './request/banner-admin-get-list-post.request';
import { BannerAdminUpdatePriority } from './request/banner-admin-update-priority.request';
import { BannerAdminUpsertAdvertisingRequest } from './request/banner-admin-upsert-advertising.request';
import { BannerAdminUpsertPostRequest } from './request/banner-admin-upsert-post.request';
import { BannerAdminGetDetailAdvertisingRequestResponse } from './response/banner-admin-get-detail-advertising-request.response';
import { BannerAdminGetDetailAdvertisingResponse } from './response/banner-admin-get-detail-advertising.response';
import { BannerAdminGetListAdvertisingRequestResponse } from './response/banner-admin-get-list-advertising-request.response';
import { BannerAdminGetListAdvertisingResponse } from './response/banner-admin-get-list-advertising.response';
import { BannerAdminGetListPostResponse } from './response/banner-admin-get-list-post.response';

@Injectable()
export class BannerAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    async createAdvertisingBanner(request: BannerAdminUpsertAdvertisingRequest): Promise<void> {
        const count = await this.prismaService.advertisingBanner.count({
            where: {
                banner: {
                    isActive: true,
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
    async getAdvertisingBanner(query: BannerAdminGetListAdvertisingRequest): Promise<BannerAdminGetListAdvertisingResponse> {
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
    async getDetailAdvertisingBanner(id: number): Promise<BannerAdminGetDetailAdvertisingResponse> {
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
        const banner = await this.prismaService.advertisingBanner.findUnique({
            where: { id },
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
    async updateAdvertisingBanner(id: number, request: BannerAdminUpsertAdvertisingRequest): Promise<void> {
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
                        type: BannerType.ADMIN,
                        priority: count + 1,
                    },
                },
            },
        });
    }
    async updateAdvertisingBannerPriority(body: BannerAdminUpdatePriority): Promise<void> {
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
    async createPostBanner(request: BannerAdminUpsertPostRequest): Promise<void> {
        const post = await this.prismaService.post.findUnique({ where: { id: request.postBanner.postId } });
        if (!post) throw new NotFoundException('Post not found');
        const count = await this.prismaService.postBanner.count({
            where: {
                banner: {
                    isActive: true,
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
    async getPostBanner(query: BannerAdminGetListPostRequest): Promise<BannerAdminGetListPostResponse> {
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
                startDate: true,
                endDate: true,
                regDate: true,
                priority: true,
                urlLink: true,
                postId: true,
                post: {
                    select: {
                        name: true,
                    },
                },
                banner: {
                    select: {
                        status: true,
                        file: true,
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
                startDate: item.startDate,
                endDate: item.endDate,
                regDate: item.regDate,
                urlLink: item.urlLink,
                priority: item.priority,
            };
        });
        const total = await this.prismaService.postBanner.count({ where: search.where });
        return new PaginationResponse(result, new PageInfo(total));
    }
    // async getDetailPostBanner(id: number): Promise<BannerAdminGetDetailPostResponse> {
    //     const count = await this.prismaService.adminPostBanner.count({
    //         where: { id, banner: { isActive: true } },
    //     });
    //     if (count === 0) throw new NotFoundException('Banner not found');
    //     const banner = await this.prismaService.adminPostBanner.findUnique({
    //         where: { id },
    //         select: {
    //             post: {
    //                 select: {
    //                     name: true,
    //                     site: true,
    //                 },
    //             },
    //             postId: true,
    //             banner: {
    //                 select: {
    //                     file: {
    //                         select: {
    //                             key: true,
    //                             fileName: true,
    //                             type: true,
    //                             size: true,
    //                         },
    //                     },
    //                     status: true,
    //                 },
    //             },
    //             startDate: true,
    //             endDate: true,
    //             regDate: true,
    //         },
    //     });
    //     return {
    //         id: id,
    //         postName: banner.post.name,
    //         siteName: banner.post.site?.name || null,
    //         bannerFile: {
    //             fileName: banner.banner.file.fileName,
    //             type: banner.banner.file.type,
    //             key: banner.banner.file.key,
    //             size: Number(banner.banner.file.size),
    //         },
    //         status: banner.banner.status,
    //         startDate: banner.startDate,
    //         endDate: banner.endDate,
    //     };
    // }
    // async updatePostBanner(id: number, body: BannerAdminUpsertPostRequest) {
    //     const count = await this.prismaService.adminPostBanner.count({ where: { id } });
    //     if (count === 0) throw new NotFoundException('Banner not found');
    //     const { startDate, endDate, ...rest } = body.adminPostBanner;
    //     await this.prismaService.banner.update({
    //         where: { id },
    //         data: {
    //             file: {
    //                 update: body.file,
    //             },
    //             status: body.status,
    //             adminPostBanner: {
    //                 update: {
    //                     data: {
    //                         ...rest,
    //                         startDate: new Date(startDate),
    //                         endDate: new Date(endDate),
    //                     },
    //                 },
    //             },
    //         },
    //     });
    // }
    // async updatePostBannerPriority(body: BannerAdminUpdatePriority): Promise<void> {
    //     const priority = (
    //         await this.prismaService.adminPostBanner.findMany({
    //             where: {
    //                 id: {
    //                     in: body.data.map((item) => item.id),
    //                 },
    //             },
    //             select: {
    //                 priority: true,
    //             },
    //         })
    //     ).map((item) => item.priority);
    //     const check = body.data.filter((item) => {
    //         return !priority.includes(item.priority);
    //     });
    //     if (check.length !== 0) throw new BadRequestException('Banners priority changes is not fully listed');
    //     await Promise.all(
    //         body.data.map(async (item) => {
    //             await this.prismaService.adminPostBanner.update({
    //                 where: {
    //                     id: item.id,
    //                 },
    //                 data: {
    //                     priority: item.priority,
    //                 },
    //             });
    //         }),
    //     );
    // }
    // async getPostBannerRequest(query: BannerAdminGetListPostRequestRequest): Promise<BannerAdminGetListPostRequestResponse> {
    //     const querySearch = {
    //         ...QueryPagingHelper.queryPaging(query),
    //         select: {
    //             status: true,
    //             id: true,
    //             requestDate: true,
    //             acceptDate: true,
    //             priority: true,
    //             postId: true,
    //             post: {
    //                 select: {
    //                     name: true,
    //                     site: {
    //                         select: {
    //                             name: true,
    //                         },
    //                     },
    //                 },
    //             },
    //             banner: {
    //                 select: {
    //                     status: true,
    //                     file: true,
    //                 },
    //             },
    //         },
    //         orderBy: {
    //             priority: Prisma.SortOrder.asc,
    //         },
    //         where: {
    //             postBanner: {
    //                 banner: {
    //                     isActive: true,
    //                 },
    //             },
    //             requestDate: query.requestDate && new Date(query.requestDate),
    //         },
    //     };
    //     if (query.keyword !== undefined) {
    //         switch (query.category) {
    //             case BannerAdminPostSearchCaterory.COMPANY: {
    //                 querySearch.where.postBanner['post'] = {
    //                     company: {
    //                         name: {
    //                             contains: query.keyword,
    //                             mode: Prisma.QueryMode.insensitive,
    //                         },
    //                     },
    //                 };
    //                 break;
    //             }
    //             case BannerAdminPostSearchCaterory.POST: {
    //                 querySearch.where.postBanner['post'] = {
    //                     name: {
    //                         contains: query.keyword,
    //                         mode: Prisma.QueryMode.insensitive,
    //                     },
    //                 };
    //                 break;
    //             }
    //             case BannerAdminPostSearchCaterory.SITE: {
    //                 querySearch.where.postBanner['post'] = {
    //                     site: {
    //                         name: {
    //                             contains: query.keyword,
    //                             mode: Prisma.QueryMode.insensitive,
    //                             not: null,
    //                         },
    //                     },
    //                 };
    //                 break;
    //             }
    //         }
    //     }
    //     const search = (await this.prismaService.companyPostBanner.findMany(querySearch)).map((item) => {
    //         return {
    //             id: item.id,
    //             postName: item.post.name,
    //             postId: item.postId,
    //             siteName: item.post.site ? item.post.site.name : null,
    //             bannerFile: {
    //                 key: item.banner.file.key,
    //                 fileName: item.banner.file.fileName,
    //                 size: Number(item.banner.file.size),
    //                 type: item.banner.file.type,
    //             },
    //             bannerStatus: item.banner.status,
    //             priority: item.priority,
    //             requestDate: item.requestDate,
    //             acceptDate: item.acceptDate,
    //             requestStatus: item.status,
    //         };
    //     });
    //     const total = await this.prismaService.companyPostBanner.count();
    //     return new PaginationResponse(search, new PageInfo(total));
    // }
    // async getDetailPostBannerRequest(id: number): Promise<BannerAdminGetDetailPostRequestResponse> {
    //     const count = await this.prismaService.companyPostBanner.count({ where: { id } });
    //     if (count === 0) throw new NotFoundException('Banner not found');
    //     const banner = await this.prismaService.companyPostBanner.findUnique({
    //         where: { id },
    //         select: {
    //             post: {
    //                 select: {
    //                     name: true,
    //                     site: {
    //                         select: {
    //                             name: true,
    //                             personInCharge: true,
    //                         },
    //                     },
    //                     company: {
    //                         select: {
    //                             id: true,
    //                             name: true,
    //                         },
    //                     },
    //                 },
    //             },
    //             postId: true,
    //             banner: {
    //                 select: {
    //                     file: {
    //                         select: {
    //                             key: true,
    //                             fileName: true,
    //                             type: true,
    //                             size: true,
    //                         },
    //                     },
    //                     status: true,
    //                 },
    //             },
    //             detail: true,
    //             desiredStartDate: true,
    //             desiredEndDate: true,
    //             requestDate: true,
    //             acceptDate: true,
    //             status: true,
    //         },
    //     });
    //     return {
    //         bannerFile: {
    //             fileName: banner.banner.file.fileName,
    //             key: banner.banner.file.key,
    //             type: banner.banner.file.type,
    //             size: Number(banner.banner.file.size),
    //         },
    //         detail: banner.detail,
    //         bannerStatus: banner.banner.status,
    //         postName: banner.post.name,
    //         siteName: banner.post.site ? banner.post.site.name : null,
    //         companyId: banner.post.company.id,
    //         companyName: banner.post.company.name,
    //         personInCharge: banner.post.site ? banner.post.site.personInCharge : null,
    //         desiredStartDate: banner.desiredStartDate,
    //         desiredEndDate: banner.desiredEndDate,
    //         acceptDate: banner.acceptDate,
    //         requestDate: banner.requestDate,
    //         requestStatus: banner.status,
    //     };
    // }
    async getAdvertisingBannerRequest(
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
                request: {
                    NOT: null,
                },
                type: BannerType.COMPANY,
            },
            ...QueryPagingHelper.queryPaging(query),
            select: {
                id: true,
                acceptDate: true,
                banner: {
                    select: {
                        file: true,
                    },
                },
                request: {
                    select: {
                        requestDate: true,
                    },
                },
                title: true,
                status: true,
            },
            orderBy: {
                banner: {
                    createdAt: Prisma.SortOrder.desc,
                },
            },
        };

        const search = (await this.prismaService.advertisingBanner.findMany(querySearch)).map((item) => {
            return {
                id: item.id,
                title: item.title,
                file: {
                    key: item.banner.file.key,
                    fileName: item.banner.file.fileName,
                    size: Number(item.banner.file.size),
                    type: item.banner.file.type,
                },
                requestDate: item.request.requestDate,
                acceptDate: item.acceptDate,
                status: item.status,
            };
        });
        const total = await this.prismaService.advertisingBanner.count();
        return new PaginationResponse(search, new PageInfo(total));
    }
    async getDetailAdvertisingBannerRequest(id: number): Promise<BannerAdminGetDetailAdvertisingRequestResponse> {
        const count = await this.prismaService.bannerRequest.count({
            where: {
                id,
                advertisingBanner: {
                    type: BannerType.COMPANY,
                    request: {
                        NOT: null,
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
    async deleteBanner(id: number): Promise<void> {
        const banner = await this.prismaService.banner.findUnique({
            where: {
                id: id,
                isActive: true,
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
            await this.prismaService.advertisingBanner.update({ where: { id }, data: { priority: null } });
            const list = await this.prismaService.advertisingBanner.findMany({
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
                    await this.prismaService.advertisingBanner.update({
                        where: {
                            id: item.id,
                        },
                        data: {
                            priority: item.priority - 1,
                        },
                    });
                }),
            );
        }
        if (banner.postBanner) {
            await this.prismaService.postBanner.update({ where: { id }, data: { priority: null } });
            const list = await this.prismaService.postBanner.findMany({
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
                    await this.prismaService.postBanner.update({
                        where: {
                            id: item.id,
                        },
                        data: {
                            priority: item.priority - 1,
                        },
                    });
                }),
            );
        }
    }
    async changeStatusBannerRequest(
        isAdvertising: boolean,
        id: number,
        body: BannerAdminChangeStatusRequestBannerRequest,
    ): Promise<void> {
        const count = await this.prismaService.bannerRequest.count({
            where: {
                id,
                postBanner: !isAdvertising ? { type: BannerType.COMPANY } : undefined,
                advertisingBanner: isAdvertising ? { type: BannerType.COMPANY } : undefined,
            },
        });
        if (count === 0) throw new NotFoundException('Banner request Id not found');
        if (!isAdvertising) {
            const count = await this.prismaService.postBanner.count({
                where: {
                    priority: {
                        not: null,
                    },
                    type: BannerType.COMPANY,
                    request: {
                        NOT: null,
                    },
                },
            });
            await this.prismaService.postBanner.update({
                where: {
                    id: id,
                },
                data: {
                    request: {
                        update: {
                            status: body.status,
                            acceptDate: body.status === RequestBannerStatus.APPROVED ? new Date() : undefined,
                            requestBannerHistories: {
                                create: {
                                    reason: body.reason,
                                    status: body.status,
                                },
                            },
                        },
                    },
                    priority: count + 1,
                },
            });
        } else {
            const count = await this.prismaService.advertisingBanner.count({
                where: {
                    priority: {
                        not: null,
                    },
                    type: BannerType.COMPANY,
                    request: {
                        NOT: null,
                    },
                },
            });
            await this.prismaService.advertisingBanner.update({
                where: {
                    id: id,
                },
                data: {
                    request: {
                        update: {
                            status: body.status,
                            acceptDate: body.status === RequestBannerStatus.APPROVED ? new Date() : undefined,
                            requestBannerHistories: {
                                create: {
                                    reason: body.reason,
                                    status: body.status,
                                },
                            },
                        },
                    },
                    priority: count + 1,
                },
            });
        }
    }
}
