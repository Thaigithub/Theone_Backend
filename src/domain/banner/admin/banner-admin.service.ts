import { Injectable, NotFoundException } from '@nestjs/common';
import { BannerStatus, PostBannerType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { PostSearchCaterory, SiteSearchCaterory } from './dto/banner-admin-search-category.dto';
import { AdminBannerChangeStatusCompanyBannerRequest } from './request/banner-admin-change-status-company-banner.request';
import { AdminBannerCreateJobPostRequest } from './request/banner-admin-create-admin-jobpost.request';
import { AdminBannerCreateGeneralRequest } from './request/banner-admin-create-general.request';
import { AdminBannerGetAdminJobPostRequest } from './request/banner-admin-get-admin-jobpost.request';
import { AdminBannerGetCompanyJobPostRequest } from './request/banner-admin-get-company-jobpost.request';
import { AdminBannerGetGeneralRequest } from './request/banner-admin-get-general.request';
import { AdminBannerGetSiteRequest } from './request/banner-admin-get-site.request';
import { AdminBannerGetDetailAdminJobPostResponse } from './response/banner-admin-get-admin-jobpost-detail.response';
import { AdminBannerGetAdminJobPostResponse } from './response/banner-admin-get-admin-jobpost.response';
import { AdminBannerGetDetailCompanyJobPostResponse } from './response/banner-admin-get-company-jobpost-detail.response';
import { AdminBannerGetCompanyJobPostResponse } from './response/banner-admin-get-company-jobpost.response';
import { AdminBannerGetDetailGeneralResponse } from './response/banner-admin-get-general-detail.response';
import { AdminBannerGetGeneralResponse } from './response/banner-admin-get-general.response';
import { AdminBannerGetDetailSiteResponse } from './response/banner-admin-get-site-detail.response';
import { AdminBannerGetSiteResponse } from './response/banner-admin-get-site.response';

@Injectable()
export class AdminBannerService {
    constructor(private readonly prismaService: PrismaService) {}

    // GENERAL BANNER
    async createGeneralBanner(request: AdminBannerCreateGeneralRequest): Promise<void> {
        const startDate = new Date(request.generalBanner.startDate);
        const endDate = new Date(request.generalBanner.endDate);
        const now = new Date();
        request.generalBanner['priority'] = null;
        if (now >= startDate && now <= endDate) {
            const count = await this.prismaService.generalBanner.count({
                where: {
                    banner: {
                        status: BannerStatus.EXPOSE,
                    },
                    priority: {
                        not: null,
                    },
                },
            });
            request.generalBanner['priority'] = count + 1;
            request['status'] = BannerStatus.EXPOSE;
        } else {
            request['status'] = BannerStatus.HIDE;
        }
        await this.prismaService.banner.create({
            data: {
                status: request['status'],
                file: {
                    create: request.file,
                },
                generalBanner: {
                    create: {
                        urlLink: request.generalBanner.urlLink,
                        title: request.generalBanner.title,
                        startDate: startDate,
                        endDate: endDate,
                        regDate: now,
                        priority: request.generalBanner['priority'],
                    },
                },
            },
        });
    }
    async getGeneralBanner(query: AdminBannerGetGeneralRequest): Promise<AdminBannerGetGeneralResponse> {
        const take = query.pageSize === undefined ? undefined : parseInt(query.pageSize);
        const skip = query.pageNumber === undefined ? undefined : (parseInt(query.pageNumber) - 1) * take;
        const search = (
            await this.prismaService.generalBanner.findMany({
                where: {
                    banner: {
                        isActive: true,
                    },
                },
                skip: skip,
                take: take,
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
            })
        ).map((item) => {
            return {
                id: item.id,
                title: item.title,
                bannerFile: {
                    key: item.banner.file.key,
                    fileName: item.banner.file.fileName,
                    size: item.banner.file.size,
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
        const total = await this.prismaService.generalBanner.count();
        return new PaginationResponse(search, new PageInfo(total));
    }
    async getDetailGeneralBanner(id: number): Promise<AdminBannerGetDetailGeneralResponse> {
        const count = await this.prismaService.generalBanner.count({ where: { id } });
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
                        file: {
                            select: {
                                key: true,
                                fileName: true,
                                type: true,
                                size: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            bannerFile: {
                key: banner.banner.file.key,
                fileName: banner.banner.file.fileName,
                type: banner.banner.file.type,
                size: banner.banner.file.size,
            },
            status: banner.banner.status,
            title: banner.title,
            urlLink: banner.urlLink,
            startDate: banner.startDate,
            endDate: banner.endDate,
            regDate: banner.regDate,
        };
    }
    // ADMIN POST BANNER
    async createAdminPostBanner(request: AdminBannerCreateJobPostRequest): Promise<void> {
        const startDate = new Date(request.postBanner.adminPostBannner.startDate);
        const endDate = new Date(request.postBanner.adminPostBannner.endDate);
        const now = new Date();
        request.postBanner.adminPostBannner['priority'] = null;
        if (now >= startDate && now <= endDate) {
            const count = await this.prismaService.adminPostBanner.count({
                where: {
                    postBanner: {
                        banner: {
                            status: BannerStatus.EXPOSE,
                        },
                    },
                    priority: {
                        not: null,
                    },
                },
            });
            request.postBanner.adminPostBannner['priority'] = count + 1;
            request['status'] = BannerStatus.EXPOSE;
        } else {
            request['status'] = BannerStatus.HIDE;
        }
        await this.prismaService.banner.create({
            data: {
                status: request['status'],
                file: {
                    create: request.file,
                },
                postBanner: {
                    create: {
                        postId: request.postBanner.postId,
                        type: PostBannerType.ADMIN,
                        adminPostBanner: {
                            create: {
                                urlLink: request.postBanner.adminPostBannner.urlLink,
                                endDate: endDate,
                                startDate: startDate,
                                priority: request.postBanner.adminPostBannner['priority'],
                                regDate: now,
                            },
                        },
                    },
                },
            },
        });
    }
    async getAdminPostBanner(query: AdminBannerGetAdminJobPostRequest): Promise<AdminBannerGetAdminJobPostResponse> {
        const take = query.pageSize === undefined ? undefined : parseInt(query.pageSize);
        const skip = query.pageNumber === undefined ? undefined : (parseInt(query.pageNumber) - 1) * take;
        const search = (
            await this.prismaService.adminPostBanner.findMany({
                where: {
                    postBanner: {
                        banner: {
                            isActive: true,
                        },
                    },
                },
                skip: skip,
                take: take,
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
            })
        ).map((item) => {
            return {
                id: item.id,
                postName: item.postBanner.post.name,
                postId: item.postBanner.postId,
                bannerFile: {
                    key: item.postBanner.banner.file.key,
                    fileName: item.postBanner.banner.file.fileName,
                    size: item.postBanner.banner.file.size,
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
        const total = await this.prismaService.generalBanner.count();
        return new PaginationResponse(search, new PageInfo(total));
    }
    async getDetailAdminPostBanner(id: number): Promise<AdminBannerGetDetailAdminJobPostResponse> {
        const count = await this.prismaService.adminPostBanner.count({ where: { id } });
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
            bannerFile: banner.banner.file,
            status: banner.banner.status,
            startDate: banner.adminPostBanner.startDate,
            endDate: banner.adminPostBanner.endDate,
            regDate: banner.adminPostBanner.regDate,
            urlLink: banner.adminPostBanner.urlLink,
        };
    }
    // COMPANY POST BANNER
    async getCompanyPostBanner(query: AdminBannerGetCompanyJobPostRequest): Promise<AdminBannerGetCompanyJobPostResponse> {
        const take = query.pageSize === undefined ? undefined : parseInt(query.pageSize);
        const skip = query.pageNumber === undefined ? undefined : (parseInt(query.pageNumber) - 1) * take;
        const querySearch = {
            skip: skip,
            take: take,
            select: {
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
                                siteName: true,
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
        };
        if (query.searchKeyword !== undefined) {
            switch (query.searchCategory) {
                case PostSearchCaterory.COMPANY: {
                    query['where'] = {
                        postBanner: {
                            post: {
                                site: {
                                    Company: {
                                        name: {
                                            contains: query.searchKeyword,
                                        },
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
                siteName: item.postBanner.post.siteName,
                bannerFile: {
                    key: item.postBanner.banner.file.key,
                    fileName: item.postBanner.banner.file.fileName,
                    size: item.postBanner.banner.file.size,
                    type: item.postBanner.banner.file.type,
                },
                status: item.postBanner.banner.status,
                priority: item.priority,
                requestDate: item.requestDate,
                acceptDate: item.acceptDate,
            };
        });
        const total = await this.prismaService.companyPostBanner.count();
        return new PaginationResponse(search, new PageInfo(total));
    }
    async getDetailCompanyPostBanner(id: number): Promise<AdminBannerGetDetailCompanyJobPostResponse> {
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
            bannerFile: banner.banner.file,
            status: banner.banner.status,
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
            requestBannerStatus: banner.companyPostBanner.status,
        };
    }
    // SITE POST BANNER
    async getSiteBanner(query: AdminBannerGetSiteRequest): Promise<AdminBannerGetSiteResponse> {
        const take = query.pageSize === undefined ? undefined : parseInt(query.pageSize);
        const skip = query.pageNumber === undefined ? undefined : (parseInt(query.pageNumber) - 1) * take;
        const querySearch = {
            where: {
                banner: {
                    isActive: true,
                },
            },
            skip: skip,
            take: take,
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
        const search = (await this.prismaService.siteBanner.findMany(querySearch)).map((item) => {
            return {
                id: item.id,
                siteName: item.site.name,
                title: item.title,
                bannerFile: {
                    key: item.banner.file.key,
                    fileName: item.banner.file.fileName,
                    size: item.banner.file.size,
                    type: item.banner.file.type,
                },
                status: item.banner.status,
                priority: item.priority,
                requestDate: item.requestDate,
                acceptDate: item.acceptDate,
            };
        });
        const total = await this.prismaService.siteBanner.count();
        return new PaginationResponse(search, new PageInfo(total));
    }
    async getDetailSiteBanner(id: number): Promise<AdminBannerGetDetailSiteResponse> {
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
            bannerFile: banner.file,
            status: banner.status,
            siteId: banner.siteBanner.siteId,
            siteName: banner.siteBanner.site.name,
            companyId: banner.siteBanner.site.companyId,
            companyName: banner.siteBanner.site.company.name,
            presentativeName: banner.siteBanner.site.company.presentativeName,
            desiredStartDate: banner.siteBanner.desiredStartDate,
            desiredEndDate: banner.siteBanner.desiredEndDate,
            acceptDate: banner.siteBanner.acceptDate,
            requestDate: banner.siteBanner.requestDate,
            requestBannerStatus: banner.siteBanner.status,
        };
    }
    // COMMON ACTION
    async deleteBanner(id: number): Promise<void> {
        const count = await this.prismaService.banner.count({ where: { id } });
        if (count === 0) throw new NotFoundException('Banner not found');
        await this.prismaService.banner.update({
            where: {
                id: id,
            },
            data: {
                isActive: false,
            },
        });
    }
    async changeCompanyStatusBanner(
        isPost: boolean,
        id: number,
        body: AdminBannerChangeStatusCompanyBannerRequest,
    ): Promise<void> {
        const count = await this.prismaService.banner.count({ where: { id } });
        if (count === 0) throw new NotFoundException('Banner Id not found');
        if (isPost) {
            await this.prismaService.companyPostBanner.update({
                where: {
                    id: id,
                },
                data: {
                    status: body.status,
                },
            });
        } else {
            await this.prismaService.siteBanner.update({
                where: {
                    id: id,
                },
                data: {
                    status: body.status,
                },
            });
        }
    }
}
