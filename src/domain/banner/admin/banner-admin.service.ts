import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostBannerType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostSearchCaterory } from './enum/banner-admin-post-search-category.enum';
import { SiteSearchCaterory } from './enum/banner-admin-site-search-category.enum';
import { BannerAdminChangeStatusCompanyBannerRequest } from './request/banner-admin-change-status-company-banner.request';
import { BannerAdminGetAdminJobPostRequest } from './request/banner-admin-get-admin-jobpost.request';
import { BannerAdminGetCompanyJobPostRequest } from './request/banner-admin-get-company-jobpost.request';
import { BannerAdminGetGeneralRequest } from './request/banner-admin-get-general.request';
import { BannerAdminGetSiteRequest } from './request/banner-admin-get-site.request';
import { BannerAdminUpdatePriority } from './request/banner-admin-update-priority.request';
import { BannerAdminUpsertJobPostRequest } from './request/banner-admin-upsert-admin-jobpost.request';
import { BannerAdminUpsertGeneralRequest } from './request/banner-admin-upsert-general.request';
import { BannerAdminGetDetailAdminJobPostResponse } from './response/banner-admin-get-admin-jobpost-detail.response';
import { BannerAdminGetAdminJobPostResponse } from './response/banner-admin-get-admin-jobpost.response';
import { BannerAdminGetDetailCompanyJobPostResponse } from './response/banner-admin-get-company-jobpost-detail.response';
import { BannerAdminGetCompanyJobPostResponse } from './response/banner-admin-get-company-jobpost.response';
import { BannerAdminGetDetailGeneralResponse } from './response/banner-admin-get-general-detail.response';
import { BannerAdminGetGeneralResponse } from './response/banner-admin-get-general.response';
import { BannerAdminGetDetailSiteResponse } from './response/banner-admin-get-site-detail.response';
import { BannerAdminGetSiteResponse } from './response/banner-admin-get-site.response';

@Injectable()
export class BannerAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    // GENERAL BANNER
    async createGeneralBanner(request: BannerAdminUpsertGeneralRequest): Promise<void> {
        const count = await this.prismaService.generalBanner.count({
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
                generalBanner: {
                    create: {
                        urlLink: request.generalBanner.urlLink,
                        title: request.generalBanner.title,
                        startDate: new Date(request.generalBanner.startDate),
                        endDate: new Date(request.generalBanner.endDate),
                        priority: count + 1,
                    },
                },
            },
        });
    }
    async getGeneralBanner(query: BannerAdminGetGeneralRequest): Promise<BannerAdminGetGeneralResponse> {
        const search = {
            where: {
                banner: {
                    isActive: true,
                },
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
        const banners = (await this.prismaService.generalBanner.findMany(search)).map((item) => {
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
        const total = await this.prismaService.generalBanner.count({ where: search.where });
        return new PaginationResponse(banners, new PageInfo(total));
    }
    async getDetailGeneralBanner(id: number): Promise<BannerAdminGetDetailGeneralResponse> {
        const count = await this.prismaService.generalBanner.count({ where: { id, banner: { isActive: true } } });
        if (count === 0) throw new NotFoundException('Banner not found');
        const banner = await this.prismaService.generalBanner.findUnique({
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
    async updateGeneralBanner(id: number, body: BannerAdminUpsertGeneralRequest): Promise<void> {
        const count = await this.prismaService.generalBanner.count({ where: { id, banner: { isActive: true } } });
        if (count === 0) throw new NotFoundException('Banner not found');
        const { startDate, endDate, ...rest } = body.generalBanner;
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
                generalBanner: {
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
    async updateGeneralBannerPriority(body: BannerAdminUpdatePriority): Promise<void> {
        const priority = (
            await this.prismaService.generalBanner.findMany({
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
                await this.prismaService.generalBanner.update({
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
    async createAdminPostBanner(request: BannerAdminUpsertJobPostRequest): Promise<void> {
        const count = await this.prismaService.adminPostBanner.count({
            where: {
                postBanner: {
                    banner: {
                        isActive: true,
                    },
                },
            },
        });
        await this.prismaService.banner.create({
            data: {
                status: request.status,
                file: {
                    create: request.file,
                },
                postBanner: {
                    create: {
                        postId: request.postBanner.postId,
                        type: PostBannerType.ADMIN,
                        adminPostBanner: {
                            create: {
                                urlLink: request.postBanner.adminPostBanner.urlLink,
                                endDate: new Date(request.postBanner.adminPostBanner.endDate),
                                startDate: new Date(request.postBanner.adminPostBanner.startDate),
                                priority: count + 1,
                            },
                        },
                    },
                },
            },
        });
    }
    async getAdminPostBanner(query: BannerAdminGetAdminJobPostRequest): Promise<BannerAdminGetAdminJobPostResponse> {
        const search = {
            where: {
                postBanner: {
                    banner: {
                        isActive: true,
                    },
                },
            },
            ...QueryPagingHelper.queryPaging(query),
            select: {
                id: true,
                startDate: true,
                endDate: true,
                regDate: true,
                priority: true,
                urlLink: true,
                postBanner: {
                    select: {
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
                },
            },
            orderBy: {
                priority: Prisma.SortOrder.asc,
            },
        };
        const result = (await this.prismaService.adminPostBanner.findMany(search)).map((item) => {
            return {
                id: item.id,
                postName: item.postBanner.post.name,
                postId: item.postBanner.postId,
                bannerFile: {
                    key: item.postBanner.banner.file.key,
                    fileName: item.postBanner.banner.file.fileName,
                    size: Number(item.postBanner.banner.file.size),
                    type: item.postBanner.banner.file.type,
                },
                status: item.postBanner.banner.status,
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
            where: { id, postBanner: { banner: { isActive: true } } },
        });
        if (count === 0) throw new NotFoundException('Banner not found');
        const banner = await this.prismaService.postBanner.findUnique({
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
                adminPostBanner: {
                    select: {
                        startDate: true,
                        endDate: true,
                        regDate: true,
                        urlLink: true,
                    },
                },
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
            startDate: banner.adminPostBanner.startDate,
            endDate: banner.adminPostBanner.endDate,
            regDate: banner.adminPostBanner.regDate,
            urlLink: banner.adminPostBanner.urlLink,
        };
    }
    async updateAdminPostBanner(id: number, body: BannerAdminUpsertJobPostRequest) {
        const count = await this.prismaService.adminPostBanner.count({ where: { id } });
        if (count === 0) throw new NotFoundException('Banner not found');
        const { adminPostBanner, ...rest } = body.postBanner;
        const { startDate, endDate, ...other } = adminPostBanner;
        await this.prismaService.banner.update({
            where: { id },
            data: {
                file: {
                    update: body.file,
                },
                status: body.status,
                postBanner: {
                    update: {
                        data: {
                            ...rest,
                            adminPostBanner: {
                                update: {
                                    data: {
                                        ...other,
                                        startDate: new Date(startDate),
                                        endDate: new Date(endDate),
                                    },
                                },
                            },
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
    async getCompanyPostBanner(query: BannerAdminGetCompanyJobPostRequest): Promise<BannerAdminGetCompanyJobPostResponse> {
        const querySearch = {
            ...QueryPagingHelper.queryPaging(query),
            select: {
                status: true,
                id: true,
                requestDate: true,
                acceptDate: true,
                priority: true,
                postBanner: {
                    select: {
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
                },
            },
            orderBy: {
                priority: Prisma.SortOrder.asc,
            },
        };
        if (query.searchKeyword !== undefined) {
            switch (query.searchCategory) {
                case PostSearchCaterory.COMPANY: {
                    query['where'] = {
                        postBanner: {
                            post: {
                                company: {
                                    name: {
                                        contains: query.searchKeyword,
                                    },
                                },
                            },
                            banner: {
                                isActive: true,
                            },
                        },
                    };
                    break;
                }
                case PostSearchCaterory.POST: {
                    query['where'] = {
                        postBanner: {
                            post: {
                                name: {
                                    contains: query.searchKeyword,
                                },
                            },
                            banner: {
                                isActive: true,
                            },
                        },
                    };
                    break;
                }
                case PostSearchCaterory.SITE: {
                    query['where'] = {
                        postBanner: {
                            post: {
                                site: {
                                    name: {
                                        contains: query.searchKeyword,
                                    },
                                },
                            },
                            banner: {
                                isActive: true,
                            },
                        },
                    };
                    break;
                }
                default: {
                    querySearch['where'] = {
                        postbanner: {
                            banner: {
                                isActive: true,
                            },
                        },
                    };
                }
            }
        }
        if (query.requestStartDate !== undefined) {
            querySearch['where']['requestDate'] = {
                gt: new Date(query.requestStartDate),
            };
        }
        if (query.requestEndDate !== undefined) {
            querySearch['where']['requestDate'] = {
                lt: new Date(query.requestEndDate),
            };
        }
        const search = (await this.prismaService.companyPostBanner.findMany(querySearch)).map((item) => {
            return {
                id: item.id,
                postName: item.postBanner.post.name,
                postId: item.postBanner.postId,
                siteName: item.postBanner.post.site ? item.postBanner.post.site.name : null,
                bannerFile: {
                    key: item.postBanner.banner.file.key,
                    fileName: item.postBanner.banner.file.fileName,
                    size: Number(item.postBanner.banner.file.size),
                    type: item.postBanner.banner.file.type,
                },
                bannerStatus: item.postBanner.banner.status,
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
        const count = await this.prismaService.banner.count({ where: { id } });
        if (count === 0) throw new NotFoundException('Banner not found');
        const banner = await this.prismaService.postBanner.findUnique({
            where: { id },
            select: {
                post: {
                    select: {
                        name: true,
                        site: {
                            select: {
                                name: true,
                                company: {
                                    select: {
                                        id: true,
                                        name: true,
                                        presentativeName: true,
                                    },
                                },
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
                companyPostBanner: {
                    select: {
                        desiredStartDate: true,
                        desiredEndDate: true,
                        requestDate: true,
                        acceptDate: true,
                        status: true,
                    },
                },
            },
        });
        return {
            bannerFile: {
                fileName: banner.banner.file.fileName,
                key: banner.banner.file.key,
                type: banner.banner.file.type,
                size: Number(banner.banner.file.size),
            },
            bannerStatus: banner.banner.status,
            postId: banner.postId,
            postName: banner.post.name,
            siteName: banner.post.site.name,
            companyId: banner.post.site.company.id,
            companyName: banner.post.site.company.name,
            presentativeName: banner.post.site.company.presentativeName,
            desiredStartDate: banner.companyPostBanner.desiredStartDate,
            desiredEndDate: banner.companyPostBanner.desiredEndDate,
            acceptDate: banner.companyPostBanner.acceptDate,
            requestDate: banner.companyPostBanner.requestDate,
            requestStatus: banner.companyPostBanner.status,
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
    async getSiteBanner(query: BannerAdminGetSiteRequest): Promise<BannerAdminGetSiteResponse> {
        const querySearch = {
            where: {
                banner: {
                    isActive: true,
                },
            },
            ...QueryPagingHelper.queryPaging(query),
            select: {
                id: true,
                requestDate: true,
                acceptDate: true,
                priority: true,
                site: {
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
                title: true,
                status: true,
            },
            orderBy: {
                priority: Prisma.SortOrder.asc,
            },
        };
        if (query.keyword !== undefined) {
            switch (query.search) {
                case SiteSearchCaterory.COMPANY: {
                    query['where'] = {
                        site: {
                            Company: {
                                name: {
                                    contains: query.keyword,
                                },
                            },
                        },
                    };
                    break;
                }
                case SiteSearchCaterory.TITLE: {
                    query['where'] = {
                        title: {
                            contains: query.keyword,
                        },
                    };
                    break;
                }
                case SiteSearchCaterory.SITE: {
                    query['where'] = {
                        site: {
                            name: {
                                contains: query.keyword,
                            },
                        },
                    };
                    break;
                }
                default: {
                    break;
                }
            }
        }
        if (query.startDate !== undefined) {
            querySearch['where']['sate'] = {
                gt: new Date(query.startDate),
            };
        }
        if (query.endDate !== undefined) {
            querySearch['where']['sate'] = {
                lt: new Date(query.endDate),
            };
        }
        const search = (await this.prismaService.siteBanner.findMany(querySearch)).map((item) => {
            return {
                id: item.id,
                siteName: item.site.name,
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
        const total = await this.prismaService.siteBanner.count();
        return new PaginationResponse(search, new PageInfo(total));
    }
    async getDetailSiteBanner(id: number): Promise<BannerAdminGetDetailSiteResponse> {
        const count = await this.prismaService.banner.count({ where: { id } });
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
                siteBanner: {
                    select: {
                        desiredEndDate: true,
                        desiredStartDate: true,
                        requestDate: true,
                        acceptDate: true,
                        status: true,
                        siteId: true,
                        site: {
                            select: {
                                name: true,
                                companyId: true,
                                company: {
                                    select: {
                                        name: true,
                                        presentativeName: true,
                                    },
                                },
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
            siteId: banner.siteBanner.siteId,
            siteName: banner.siteBanner.site.name,
            companyId: banner.siteBanner.site.companyId,
            companyName: banner.siteBanner.site.company.name,
            presentativeName: banner.siteBanner.site.company.presentativeName,
            desiredStartDate: banner.siteBanner.desiredStartDate,
            desiredEndDate: banner.siteBanner.desiredEndDate,
            acceptDate: banner.siteBanner.acceptDate,
            requestDate: banner.siteBanner.requestDate,
            requestStatus: banner.siteBanner.status,
        };
    }
    async updateSiteBannerPriority(body: BannerAdminUpdatePriority): Promise<void> {
        const priority = (
            await this.prismaService.siteBanner.findMany({
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
                await this.prismaService.siteBanner.update({
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
                generalBanner: {
                    select: {
                        priority: true,
                    },
                },
                siteBanner: {
                    select: {
                        priority: true,
                    },
                },
                postBanner: {
                    select: {
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
                },
            },
        });
        if (!banner) throw new NotFoundException('Banner not found');
        if (banner.generalBanner) {
            await this.prismaService.generalBanner.update({ where: { id }, data: { priority: null } });
            const list = await this.prismaService.generalBanner.findMany({
                where: {
                    priority: {
                        gt: banner.generalBanner.priority,
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
                    await this.prismaService.generalBanner.update({
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
        if (banner.siteBanner) {
            await this.prismaService.siteBanner.update({ where: { id }, data: { priority: null } });
            const list = await this.prismaService.siteBanner.findMany({
                where: {
                    priority: {
                        gt: banner.siteBanner.priority,
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
                    await this.prismaService.siteBanner.update({
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
        if (banner.postBanner && banner.postBanner.adminPostBanner) {
            await this.prismaService.adminPostBanner.update({ where: { id }, data: { priority: null } });
            console.log(banner.postBanner.adminPostBanner.priority);
            const list = await this.prismaService.adminPostBanner.findMany({
                where: {
                    priority: {
                        gt: banner.postBanner.adminPostBanner.priority,
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
        if (banner.postBanner && banner.postBanner.companyPostBanner) {
            await this.prismaService.companyPostBanner.update({ where: { id }, data: { priority: null } });
            const list = await this.prismaService.companyPostBanner.findMany({
                where: {
                    priority: {
                        gt: banner.postBanner.companyPostBanner.priority,
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
                },
            });
        } else {
            const count = await this.prismaService.siteBanner.count({
                where: {
                    priority: {
                        not: null,
                    },
                },
            });
            await this.prismaService.siteBanner.update({
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
