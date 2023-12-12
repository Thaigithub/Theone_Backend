import { Injectable } from '@nestjs/common';
import { BannerStatus, PostBannerType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { PostSearchCaterory, SiteSearchCaterory } from './dto/banner-admin-search-category.dto';
import { AdminBannerCreateJobPostRequest } from './request/banner-admin-create-admin-jobpost.request';
import { AdminBannerCreateGeneralRequest } from './request/banner-admin-create-general.request';
import { AdminBannerGetAdminJobPostRequest } from './request/banner-admin-get-admin-jobpost.request';
import { AdminBannerGetCompanyJobPostRequest } from './request/banner-admin-get-company-jobpost.request';
import { AdminBannerGetGeneralRequest } from './request/banner-admin-get-general.request';
import { AdminBannerGetSiteRequest } from './request/banner-admin-get-site.request';
import { AdminBannerGetAdminJobPostResponse } from './response/banner-admin-get-admin-jobpost.response';
import { AdminBannerGetCompanyJobPostResponse } from './response/banner-admin-get-company-jobpost.response';
import { AdminBannerGetGeneralResponse } from './response/banner-admin-get-general.response';
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
        };
        if (query.keyword !== undefined) {
            switch (query.search) {
                case PostSearchCaterory.COMPANY: {
                    query['where'] = {
                        postBanner: {
                            post: {
                                site: {
                                    Company: {
                                        name: {
                                            contains: query.keyword,
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
                                    contains: query.keyword,
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
                                        contains: query.keyword,
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
                siteName: item.postBanner.post.site.name,
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

    async deleteBanner(id: number): Promise<void> {
        await this.prismaService.banner.update({
            where: {
                id: id,
            },
            data: {
                isActive: false,
            },
        });
    }
}
