import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { BannerAdminAdvertisingSearchCategory } from './enum/banner-admin-advertisng-search-category.enum';
import { BannerAdminPostSearchCaterory } from './enum/banner-admin-post-search-category.enum';
import { BannerAdminChangeStatusCompanyBannerRequest } from './request/banner-admin-change-status-company-banner.request';
import { BannerAdminGetListAdminAdvertisingRequest } from './request/banner-admin-get-list-admin-advertising.request';
import { BannerAdminGetListAdminJobPostRequest } from './request/banner-admin-get-list-admin-jobpost.request';
import { BannerAdminGetListCompanyAdvertisingRequest } from './request/banner-admin-get-list-company-advertising.request';
import { BannerAdminGetListCompanyJobPostRequest } from './request/banner-admin-get-list-company-jobpost.request';
import { BannerAdminUpdatePriority } from './request/banner-admin-update-priority.request';
import { BannerAdminUpsertAdminAdvertisingRequest } from './request/banner-admin-upsert-admin-advertising.request';
import { BannerAdminUpsertAdminJobPostRequest } from './request/banner-admin-upsert-admin-jobpost.request';
import { BannerAdminGetDetailAdminAdvertisingResponse } from './response/banner-admin-get-detail-admin-advertising.response';
import { BannerAdminGetDetailAdminJobPostResponse } from './response/banner-admin-get-detail-admin-jobpost.response';
import { BannerAdminGetDetailCompanyAdvertisingResponse } from './response/banner-admin-get-detail-company-advertising.response';
import { BannerAdminGetDetailCompanyJobPostResponse } from './response/banner-admin-get-detail-company-jobpost.response';
import { BannerAdminGetListAdminAdvertisingResponse } from './response/banner-admin-get-list-admin-advertising.response';
import { BannerAdminGetListAdminJobPostResponse } from './response/banner-admin-get-list-admin-jobpost.response';
import { BannerAdminGetListCompanyAdvertisingResponse } from './response/banner-admin-get-list-company-advertising.response';
import { BannerAdminGetListCompanyJobPostResponse } from './response/banner-admin-get-list-company-jobpost.response';

@Injectable()
export class BannerAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    // GENERAL BANNER
    async createAdminAdvertisingBanner(request: BannerAdminUpsertAdminAdvertisingRequest): Promise<void> {
        const count = await this.prismaService.adminAdvertisingBanner.count({
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
                adminAdvertisingBanner: {
                    create: {
                        urlLink: request.adminAdvertisingBanner.urlLink,
                        title: request.adminAdvertisingBanner.title,
                        startDate: new Date(request.adminAdvertisingBanner.startDate),
                        endDate: new Date(request.adminAdvertisingBanner.endDate),
                        priority: count + 1,
                    },
                },
            },
        });
    }
    async getAdminAdvertisingBanner(
        query: BannerAdminGetListAdminAdvertisingRequest,
    ): Promise<BannerAdminGetListAdminAdvertisingResponse> {
        const search = {
            where: {
                banner: {
                    isActive: true,
                    status: query.status,
                },
                startDate: query.startDate && new Date(query.startDate),
                endDate: query.endDate && new Date(query.endDate),
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
            },
            ...QueryPagingHelper.queryPaging(query),
            select: {
                banner: {
                    select: {
                        status: true,
                        file: true,
                    },
                },
                id: true,
                title: true,
                startDate: true,
                endDate: true,
                regDate: true,
                urlLink: true,
                priority: true,
            },
            orderBy: {
                priority: Prisma.SortOrder.asc,
            },
        };
        const banners = (await this.prismaService.adminAdvertisingBanner.findMany(search)).map((item) => {
            return {
                id: item.id,
                title: item.title,
                bannerFile: {
                    key: item.banner.file.key,
                    fileName: item.banner.file.fileName,
                    size: Number(item.banner.file.size),
                    type: item.banner.file.type,
                },
                startDate: item.startDate,
                endDate: item.endDate,
                regDate: item.regDate,
                status: item.banner.status,
                urlLink: item.urlLink,
                priority: item.priority,
            };
        });
        const total = await this.prismaService.adminAdvertisingBanner.count({ where: search.where });
        return new PaginationResponse(banners, new PageInfo(total));
    }
    async getDetailAdminAdvertisingBanner(id: number): Promise<BannerAdminGetDetailAdminAdvertisingResponse> {
        const count = await this.prismaService.adminAdvertisingBanner.count({ where: { id, banner: { isActive: true } } });
        if (count === 0) throw new NotFoundException('Banner not found');
        const banner = await this.prismaService.adminAdvertisingBanner.findUnique({
            where: { id },
            select: {
                urlLink: true,
                title: true,
                startDate: true,
                endDate: true,
                regDate: true,
                banner: {
                    select: {
                        status: true,
                        file: true,
                    },
                },
            },
        });
        return {
            bannerFile: {
                key: banner.banner.file.key,
                fileName: banner.banner.file.fileName,
                type: banner.banner.file.type,
                size: Number(banner.banner.file.size),
            },
            status: banner.banner.status,
            title: banner.title,
            urlLink: banner.urlLink,
            startDate: banner.startDate,
            endDate: banner.endDate,
            regDate: banner.regDate,
        };
    }
    async updateAdminAdvertisingBanner(id: number, body: BannerAdminUpsertAdminAdvertisingRequest): Promise<void> {
        const count = await this.prismaService.adminAdvertisingBanner.count({ where: { id, banner: { isActive: true } } });
        if (count === 0) throw new NotFoundException('Banner not found');
        const { startDate, endDate, ...rest } = body.adminAdvertisingBanner;
        await this.prismaService.banner.update({
            where: {
                id,
            },
            data: {
                status: body.status,
                file: {
                    update: {
                        data: body.file,
                    },
                },
                adminAdvertisingBanner: {
                    update: {
                        data: {
                            ...rest,
                            startDate: new Date(startDate),
                            endDate: new Date(endDate),
                        },
                    },
                },
            },
        });
    }
    async updateAdminAdvertisingBannerPriority(body: BannerAdminUpdatePriority): Promise<void> {
        const priority = (
            await this.prismaService.adminAdvertisingBanner.findMany({
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
                await this.prismaService.adminAdvertisingBanner.update({
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
    // ADMIN POST BANNER
    async createAdminPostBanner(request: BannerAdminUpsertAdminJobPostRequest): Promise<void> {
        const post = await this.prismaService.post.findUnique({ where: { id: request.adminPostBanner.postId } });
        if (!post) throw new NotFoundException('Post not found');
        const count = await this.prismaService.adminPostBanner.count({
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
                adminPostBanner: {
                    create: {
                        postId: request.adminPostBanner.postId,
                        urlLink: request.adminPostBanner.urlLink,
                        endDate: new Date(request.adminPostBanner.endDate),
                        startDate: new Date(request.adminPostBanner.startDate),
                        priority: count + 1,
                    },
                },
            },
        });
    }
    async getAdminPostBanner(query: BannerAdminGetListAdminJobPostRequest): Promise<BannerAdminGetListAdminJobPostResponse> {
        const search = {
            where: {
                banner: {
                    isActive: true,
                    status: query.status,
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
                startDate: query.startDate && new Date(query.startDate),
                endDate: query.endDate && new Date(query.endDate),
                urlLink:
                    query.category &&
                    (query.category === BannerAdminAdvertisingSearchCategory.URL
                        ? {
                              contains: query.keyword,
                              mode: Prisma.QueryMode.insensitive,
                          }
                        : undefined),
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
        const result = (await this.prismaService.adminPostBanner.findMany(search)).map((item) => {
            return {
                id: item.id,
                postName: item.post.name,
                postId: item.postId,
                bannerFile: {
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
        const total = await this.prismaService.adminPostBanner.count({ where: search.where });
        return new PaginationResponse(result, new PageInfo(total));
    }
    async getDetailAdminPostBanner(id: number): Promise<BannerAdminGetDetailAdminJobPostResponse> {
        const count = await this.prismaService.adminPostBanner.count({
            where: { id, banner: { isActive: true } },
        });
        if (count === 0) throw new NotFoundException('Banner not found');
        const banner = await this.prismaService.adminPostBanner.findUnique({
            where: { id },
            select: {
                post: {
                    select: {
                        name: true,
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
                    },
                },
                startDate: true,
                endDate: true,
                regDate: true,
                urlLink: true,
            },
        });
        return {
            id: id,
            postName: banner.post.name,
            postId: banner.postId,
            bannerFile: {
                fileName: banner.banner.file.fileName,
                type: banner.banner.file.type,
                key: banner.banner.file.key,
                size: Number(banner.banner.file.size),
            },
            status: banner.banner.status,
            startDate: banner.startDate,
            endDate: banner.endDate,
            regDate: banner.regDate,
            urlLink: banner.urlLink,
        };
    }
    async updateAdminPostBanner(id: number, body: BannerAdminUpsertAdminJobPostRequest) {
        const count = await this.prismaService.adminPostBanner.count({ where: { id } });
        if (count === 0) throw new NotFoundException('Banner not found');
        const { startDate, endDate, ...rest } = body.adminPostBanner;
        await this.prismaService.banner.update({
            where: { id },
            data: {
                file: {
                    update: body.file,
                },
                status: body.status,
                adminPostBanner: {
                    update: {
                        data: {
                            ...rest,
                            startDate: new Date(startDate),
                            endDate: new Date(endDate),
                        },
                    },
                },
            },
        });
    }
    async updateAdminPostBannerPriority(body: BannerAdminUpdatePriority): Promise<void> {
        const priority = (
            await this.prismaService.adminPostBanner.findMany({
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
                await this.prismaService.adminPostBanner.update({
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
    // COMPANY POST BANNER
    async getCompanyPostBanner(
        query: BannerAdminGetListCompanyJobPostRequest,
    ): Promise<BannerAdminGetListCompanyJobPostResponse> {
        const querySearch = {
            ...QueryPagingHelper.queryPaging(query),
            select: {
                status: true,
                id: true,
                requestDate: true,
                acceptDate: true,
                priority: true,
                postId: true,
                post: {
                    select: {
                        name: true,
                        site: {
                            select: {
                                name: true,
                            },
                        },
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
            where: {
                postBanner: {
                    banner: {
                        isActive: true,
                    },
                },
                requestDate: query.requestDate && new Date(query.requestDate),
            },
        };
        if (query.keyword !== undefined) {
            switch (query.category) {
                case BannerAdminPostSearchCaterory.COMPANY: {
                    querySearch.where.postBanner['post'] = {
                        company: {
                            name: {
                                contains: query.keyword,
                                mode: Prisma.QueryMode.insensitive,
                            },
                        },
                    };
                    break;
                }
                case BannerAdminPostSearchCaterory.POST: {
                    querySearch.where.postBanner['post'] = {
                        name: {
                            contains: query.keyword,
                            mode: Prisma.QueryMode.insensitive,
                        },
                    };
                    break;
                }
                case BannerAdminPostSearchCaterory.SITE: {
                    querySearch.where.postBanner['post'] = {
                        site: {
                            name: {
                                contains: query.keyword,
                                mode: Prisma.QueryMode.insensitive,
                                not: null,
                            },
                        },
                    };
                    break;
                }
            }
        }
        const search = (await this.prismaService.companyPostBanner.findMany(querySearch)).map((item) => {
            return {
                id: item.id,
                postName: item.post.name,
                postId: item.postId,
                siteName: item.post.site ? item.post.site.name : null,
                bannerFile: {
                    key: item.banner.file.key,
                    fileName: item.banner.file.fileName,
                    size: Number(item.banner.file.size),
                    type: item.banner.file.type,
                },
                bannerStatus: item.banner.status,
                priority: item.priority,
                requestDate: item.requestDate,
                acceptDate: item.acceptDate,
                requestStatus: item.status,
            };
        });
        const total = await this.prismaService.companyPostBanner.count();
        return new PaginationResponse(search, new PageInfo(total));
    }
    async getDetailCompanyPostBanner(id: number): Promise<BannerAdminGetDetailCompanyJobPostResponse> {
        const count = await this.prismaService.companyPostBanner.count({ where: { id } });
        if (count === 0) throw new NotFoundException('Banner not found');
        const banner = await this.prismaService.companyPostBanner.findUnique({
            where: { id },
            select: {
                post: {
                    select: {
                        name: true,
                        site: {
                            select: {
                                name: true,
                                personInCharge: true,
                            },
                        },
                        company: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
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
                    },
                },
                title: true,
                detail: true,
                desiredStartDate: true,
                desiredEndDate: true,
                requestDate: true,
                acceptDate: true,
                status: true,
            },
        });
        return {
            bannerFile: {
                fileName: banner.banner.file.fileName,
                key: banner.banner.file.key,
                type: banner.banner.file.type,
                size: Number(banner.banner.file.size),
            },
            title: banner.title,
            detail: banner.detail,
            bannerStatus: banner.banner.status,
            postId: banner.postId,
            postName: banner.post.name,
            siteName: banner.post.site ? banner.post.site.name : null,
            companyId: banner.post.company.id,
            companyName: banner.post.company.name,
            personInCharge: banner.post.site ? banner.post.site.personInCharge : null,
            desiredStartDate: banner.desiredStartDate,
            desiredEndDate: banner.desiredEndDate,
            acceptDate: banner.acceptDate,
            requestDate: banner.requestDate,
            requestStatus: banner.status,
        };
    }
    async updateCompanyPostBannerPriority(body: BannerAdminUpdatePriority): Promise<void> {
        const priority = (
            await this.prismaService.companyPostBanner.findMany({
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
                await this.prismaService.companyPostBanner.update({
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
    // SITE POST BANNER
    async getCompanyAdvertisingBanner(
        query: BannerAdminGetListCompanyAdvertisingRequest,
    ): Promise<BannerAdminGetListCompanyAdvertisingResponse> {
        const querySearch = {
            where: {
                banner: {
                    isActive: true,
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
                requestDate: query.requestDate && new Date(query.requestDate),
            },
            ...QueryPagingHelper.queryPaging(query),
            select: {
                id: true,
                requestDate: true,
                acceptDate: true,
                priority: true,
                banner: {
                    select: {
                        status: true,
                        file: true,
                    },
                },
                title: true,
                status: true,
            },
            orderBy: {
                priority: Prisma.SortOrder.asc,
            },
        };

        const search = (await this.prismaService.companyAdvertisingBanner.findMany(querySearch)).map((item) => {
            return {
                id: item.id,
                title: item.title,
                bannerFile: {
                    key: item.banner.file.key,
                    fileName: item.banner.file.fileName,
                    size: Number(item.banner.file.size),
                    type: item.banner.file.type,
                },
                bannerStatus: item.banner.status,
                priority: item.priority,
                requestDate: item.requestDate,
                acceptDate: item.acceptDate,
                requestStatus: item.status,
            };
        });
        const total = await this.prismaService.companyAdvertisingBanner.count();
        return new PaginationResponse(search, new PageInfo(total));
    }
    async getDetailCompanyAdvertisingBanner(id: number): Promise<BannerAdminGetDetailCompanyAdvertisingResponse> {
        const count = await this.prismaService.companyAdvertisingBanner.count({ where: { id } });
        if (count === 0) throw new NotFoundException('Banner not found');
        const banner = await this.prismaService.banner.findUnique({
            where: { id },
            select: {
                file: {
                    select: {
                        fileName: true,
                        size: true,
                        type: true,
                        key: true,
                    },
                },
                status: true,
                companyAdvertisingBanner: {
                    select: {
                        desiredEndDate: true,
                        desiredStartDate: true,
                        requestDate: true,
                        acceptDate: true,
                        status: true,
                        title: true,
                        detail: true,
                        company: {
                            select: {
                                name: true,
                                contactName: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            bannerFile: {
                fileName: banner.file.fileName,
                key: banner.file.key,
                type: banner.file.type,
                size: Number(banner.file.size),
            },
            bannerStatus: banner.status,
            companyName: banner.companyAdvertisingBanner.company.name,
            personInCharge: banner.companyAdvertisingBanner.company.contactName,
            desiredStartDate: banner.companyAdvertisingBanner.desiredStartDate,
            desiredEndDate: banner.companyAdvertisingBanner.desiredEndDate,
            acceptDate: banner.companyAdvertisingBanner.acceptDate,
            requestDate: banner.companyAdvertisingBanner.requestDate,
            requestStatus: banner.companyAdvertisingBanner.status,
            title: banner.companyAdvertisingBanner.title,
            detail: banner.companyAdvertisingBanner.detail,
        };
    }
    async updateCompanyAdvertisingBannerPriority(body: BannerAdminUpdatePriority): Promise<void> {
        const priority = (
            await this.prismaService.companyAdvertisingBanner.findMany({
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
                await this.prismaService.companyAdvertisingBanner.update({
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
    // COMMON ACTION
    async deleteBanner(id: number): Promise<void> {
        const banner = await this.prismaService.banner.findUnique({
            where: {
                id: id,
                isActive: true,
            },
            select: {
                adminAdvertisingBanner: {
                    select: {
                        priority: true,
                    },
                },
                companyAdvertisingBanner: {
                    select: {
                        priority: true,
                    },
                },
                adminPostBanner: {
                    select: {
                        priority: true,
                    },
                },
                companyPostBanner: {
                    select: {
                        priority: true,
                    },
                },
            },
        });
        if (!banner) throw new NotFoundException('Banner not found');
        if (banner.adminAdvertisingBanner) {
            await this.prismaService.adminAdvertisingBanner.update({ where: { id }, data: { priority: null } });
            const list = await this.prismaService.adminAdvertisingBanner.findMany({
                where: {
                    priority: {
                        gt: banner.adminAdvertisingBanner.priority,
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
                    await this.prismaService.adminAdvertisingBanner.update({
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
        if (banner.companyAdvertisingBanner) {
            await this.prismaService.companyAdvertisingBanner.update({ where: { id }, data: { priority: null } });
            const list = await this.prismaService.companyAdvertisingBanner.findMany({
                where: {
                    priority: {
                        gt: banner.companyAdvertisingBanner.priority,
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
                    await this.prismaService.companyAdvertisingBanner.update({
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
        if (banner.adminPostBanner) {
            await this.prismaService.adminPostBanner.update({ where: { id }, data: { priority: null } });
            const list = await this.prismaService.adminPostBanner.findMany({
                where: {
                    priority: {
                        gt: banner.adminPostBanner.priority,
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
                    await this.prismaService.adminPostBanner.update({
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
        if (banner.companyPostBanner) {
            await this.prismaService.companyPostBanner.update({ where: { id }, data: { priority: null } });
            const list = await this.prismaService.companyPostBanner.findMany({
                where: {
                    priority: {
                        gt: banner.companyPostBanner.priority,
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
                    await this.prismaService.companyPostBanner.update({
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
    async changeCompanyStatusBanner(
        isPost: boolean,
        id: number,
        body: BannerAdminChangeStatusCompanyBannerRequest,
    ): Promise<void> {
        const count = await this.prismaService.banner.count({ where: { id } });
        if (count === 0) throw new NotFoundException('Banner Id not found');
        if (isPost) {
            const count = await this.prismaService.companyPostBanner.count({
                where: {
                    priority: {
                        not: null,
                    },
                },
            });
            await this.prismaService.companyPostBanner.update({
                where: {
                    id: id,
                },
                data: {
                    status: body.status,
                    priority: count + 1,
                    companyBannerHistories: {
                        create: {
                            reason: body.reason,
                            status: body.status,
                        },
                    },
                },
            });
        } else {
            const count = await this.prismaService.companyAdvertisingBanner.count({
                where: {
                    priority: {
                        not: null,
                    },
                },
            });
            await this.prismaService.companyAdvertisingBanner.update({
                where: {
                    id: id,
                },
                data: {
                    status: body.status,
                    priority: count + 1,
                },
            });
        }
    }
}
