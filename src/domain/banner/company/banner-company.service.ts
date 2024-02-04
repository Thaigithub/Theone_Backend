import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BannerType, Prisma, RequestBannerStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { BannerCompanyBannerStatus } from './enum/banner-company-banner-status.enum';
import { BannerCompanyBannerType } from './enum/banner-company-banner-type.enum';
import { BannerCompanyGetListRequestRequest } from './request/banner-company-get-list-request.request';
import { BannerCompanyUpsertRequestRequest } from './request/banner-company-upsert.request';
import { BannerCompanyGetDetailRequestResponse } from './response/banner-company-get-detail-request.response';
import { BannerCompanyGetListRequestResponse } from './response/banner-company-get-list-request.response';
import { Error } from 'utils/error.enum';

@Injectable()
export class BannerCompanyService {
    constructor(private prismaService: PrismaService) {}
    async getListRequest(
        accountId: number,
        query: BannerCompanyGetListRequestRequest,
    ): Promise<BannerCompanyGetListRequestResponse> {
        const search = {
            ...QueryPagingHelper.queryPaging(query),
            select: {
                status: true,
                requestDate: true,
                id: true,
                postBanner: {
                    select: {
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
                                startDate: true,
                                endDate: true,
                                status: true,
                            },
                        },
                    },
                },
                advertisingBanner: {
                    select: {
                        urlLink: true,
                        title: true,
                        banner: {
                            select: {
                                startDate: true,
                                endDate: true,
                                status: true,
                            },
                        },
                    },
                },
            },
            where: {
                company: {
                    accountId,
                },
                isActive: true,
            },
            orderBy: {
                requestDate: Prisma.SortOrder.desc,
            },
        };
        const banner = (await this.prismaService.bannerRequest.findMany(search)).map((item) => {
            let status = null;
            if (item.status === RequestBannerStatus.DENY) status = BannerCompanyBannerStatus.REJECT;
            if (item.status === RequestBannerStatus.PENDING) status = BannerCompanyBannerStatus.WAITING_FOR_APPROVAL;
            if (item.advertisingBanner) {
                if (item.status === RequestBannerStatus.APPROVED && item.advertisingBanner.banner.endDate < new Date())
                    status = BannerCompanyBannerStatus.EXPOSE_END;
                if (
                    item.status === RequestBannerStatus.APPROVED &&
                    item.advertisingBanner.banner.endDate > new Date() &&
                    item.advertisingBanner.banner.startDate < new Date()
                )
                    status = BannerCompanyBannerStatus.EXPOSE;
                if (item.status === RequestBannerStatus.APPROVED && item.advertisingBanner.banner.startDate > new Date())
                    status = BannerCompanyBannerStatus.APPROVED;
                return {
                    id: item.id,
                    status: status,
                    name: item.advertisingBanner.title,
                    info: item.advertisingBanner.urlLink,
                    startDate: item.advertisingBanner.banner.startDate,
                    endDate: item.advertisingBanner.banner.endDate,
                    requestDate: item.requestDate,
                };
            } else {
                if (item.status === RequestBannerStatus.APPROVED && item.postBanner.banner.endDate < new Date())
                    status = BannerCompanyBannerStatus.EXPOSE_END;
                if (item.status === RequestBannerStatus.APPROVED && item.postBanner.banner.startDate > new Date())
                    status = BannerCompanyBannerStatus.APPROVED;
                if (
                    item.status === RequestBannerStatus.APPROVED &&
                    item.postBanner.banner.endDate > new Date() &&
                    item.postBanner.banner.startDate < new Date()
                )
                    status = BannerCompanyBannerStatus.EXPOSE;
                return {
                    id: item.id,
                    status: status,
                    name: item.postBanner.post.name,
                    info: item.postBanner.post.site?.name || null,
                    startDate: item.postBanner.banner.startDate,
                    endDate: item.postBanner.banner.endDate,
                    requestDate: item.requestDate,
                };
            }
        });
        const total = await this.prismaService.bannerRequest.count({ where: search.where });
        return new PaginationResponse(banner, new PageInfo(total));
    }

    async createRequest(accountId: number, body: BannerCompanyUpsertRequestRequest): Promise<void> {
        if (!body.advertisingBanner && !body.postBanner) throw new BadRequestException(Error.BANNER_REQUEST_IS_NOT_APPROPRIATE);
        if (body.postBanner) {
            const post = await this.prismaService.post.findUnique({
                where: {
                    id: body.postBanner.postId,
                    company: {
                        accountId,
                    },
                    isActive: true,
                },
            });
            if (!post) throw new NotFoundException(Error.POST_NOT_FOUND);
        }
        const companyId = (await this.prismaService.company.findUnique({ where: { accountId }, select: { id: true } })).id;
        if (body.advertisingBanner) {
            await this.prismaService.banner.create({
                data: {
                    file: {
                        create: body.file,
                    },
                    endDate: new Date(body.endDate),
                    startDate: new Date(body.startDate),
                    advertisingBanner: {
                        create: {
                            type: BannerType.COMPANY,
                            urlLink: body.advertisingBanner.urlLink,
                            title: body.advertisingBanner.title,
                            request: {
                                create: {
                                    detail: body.detail,
                                    companyId: companyId,
                                },
                            },
                        },
                    },
                },
            });
        } else {
            await this.prismaService.banner.create({
                data: {
                    file: {
                        create: body.file,
                    },
                    startDate: new Date(body.startDate),
                    endDate: new Date(body.endDate),
                    postBanner: {
                        create: {
                            type: BannerType.COMPANY,
                            postId: body.postBanner.postId,
                            request: {
                                create: {
                                    detail: body.detail,
                                    companyId: companyId,
                                },
                            },
                        },
                    },
                },
            });
        }
    }

    async getDetailRequest(accountId: number, id: number): Promise<BannerCompanyGetDetailRequestResponse> {
        const request = await this.prismaService.bannerRequest.findUnique({
            where: {
                id,
                company: {
                    accountId,
                },
                isActive: true,
            },
            select: {
                detail: true,
                status: true,
                advertisingBanner: {
                    select: {
                        title: true,
                        urlLink: true,
                        banner: {
                            select: {
                                startDate: true,
                                endDate: true,
                                file: true,
                            },
                        },
                    },
                },
                postBanner: {
                    select: {
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
                                startDate: true,
                                endDate: true,
                                file: true,
                            },
                        },
                    },
                },
            },
        });
        if (!request) throw new NotFoundException(Error.BANNER_REQUEST_NOT_FOUND);
        if (request.advertisingBanner) {
            return {
                type: BannerCompanyBannerType.ADVERTISING,
                file: {
                    fileName: request.advertisingBanner.banner.file.fileName,
                    type: request.advertisingBanner.banner.file.type,
                    key: request.advertisingBanner.banner.file.key,
                    size: Number(request.advertisingBanner.banner.file.fileName),
                },
                startDate: request.advertisingBanner.banner.startDate,
                endDate: request.advertisingBanner.banner.endDate,
                detail: request.detail,
                requestStatus: request.status,
                banner: {
                    title: request.advertisingBanner.title,
                    urlLink: request.advertisingBanner.urlLink,
                },
            };
        } else {
            return {
                type: BannerCompanyBannerType.POST,
                file: {
                    fileName: request.postBanner.banner.file.fileName,
                    type: request.postBanner.banner.file.type,
                    key: request.postBanner.banner.file.key,
                    size: Number(request.postBanner.banner.file.fileName),
                },
                startDate: request.postBanner.banner.startDate,
                endDate: request.postBanner.banner.endDate,
                detail: request.detail,
                requestStatus: request.status,
                banner: {
                    postName: request.postBanner.post.name,
                    siteName: request.postBanner.post.site?.name || null,
                },
            };
        }
    }

    async deleteRequest(accountId: number, id: number): Promise<void> {
        const request = await this.prismaService.bannerRequest.findUnique({
            where: {
                id,
                company: {
                    accountId,
                },
                isActive: true,
            },
        });
        if (!request) throw new NotFoundException(Error.BANNER_REQUEST_NOT_FOUND);
        await this.prismaService.bannerRequest.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    }
}
