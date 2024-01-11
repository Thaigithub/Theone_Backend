import { BadRequestException, Injectable } from '@nestjs/common';
import { BannerStatus, RequestBannerStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { BannerCompanyBannerStatus } from './enum/banner-company-banner-status.enum';
import { BannerCompanyBannerType } from './enum/banner-company-banner-type.enum';
import { BannerCompanyGetListRequest } from './request/banner-company-get-list.request';
import { BannerCompanyUpsertRequest } from './request/banner-company-upsert.request';
import { BannerCompanyGetDetailResponse } from './response/banner-company-get-detail.response';
import { BannerCompanyGetListResponse } from './response/banner-company-get-list.response';

@Injectable()
export class BannerCompanyService {
    constructor(private prismaService: PrismaService) {}
    async getList(accountId: number, query: BannerCompanyGetListRequest): Promise<BannerCompanyGetListResponse> {
        const search = {
            ...QueryPagingHelper.queryPaging(query),
            select: {
                status: true,
                file: true,
                companyAdvertisingBanner: true,
                companyPostBanner: {
                    select: {
                        post: {
                            select: {
                                name: true,
                                site: true,
                            },
                        },
                        status: true,
                        desiredStartDate: true,
                        desiredEndDate: true,
                        requestDate: true,
                    },
                },
            },
            where: {
                OR: [
                    {
                        companyPostBanner: {
                            post: {
                                company: {
                                    accountId,
                                },
                            },
                        },
                    },
                    {
                        companyAdvertisingBanner: {
                            company: {
                                accountId,
                            },
                        },
                    },
                ],
                adminAdvertisingBanner: null,
                adminPostBanner: null,
                companyAdvertisingBanner: query.type
                    ? query.type === BannerCompanyBannerType.ADVERTISING
                        ? { NOT: null }
                        : undefined
                    : undefined,
                companyPostBanner: query.type
                    ? query.type === BannerCompanyBannerType.POST
                        ? { NOT: null }
                        : undefined
                    : undefined,
            },
        };
        const banner = (await this.prismaService.banner.findMany(search)).map((item) => {
            let status = null;
            if (
                item.status === BannerStatus.EXPOSE &&
                (item.companyAdvertisingBanner
                    ? item.companyAdvertisingBanner.status === RequestBannerStatus.APPROVED
                    : item.companyPostBanner.status === RequestBannerStatus.APPROVED)
            )
                status = BannerCompanyBannerStatus.EXPOSE;
            if (
                item.companyAdvertisingBanner
                    ? item.companyAdvertisingBanner.status === RequestBannerStatus.DENY
                    : item.companyPostBanner.status === RequestBannerStatus.DENY
            )
                status = BannerCompanyBannerStatus.REJECT;
            if (
                item.status === BannerStatus.HIDE &&
                (item.companyAdvertisingBanner
                    ? item.companyAdvertisingBanner.status === RequestBannerStatus.APPROVED
                    : item.companyPostBanner.status === RequestBannerStatus.APPROVED)
            )
                status = BannerCompanyBannerStatus.EXPOSE_END;
            if (
                item.companyAdvertisingBanner
                    ? item.companyAdvertisingBanner.status === RequestBannerStatus.PENDING ||
                      item.companyAdvertisingBanner.status === RequestBannerStatus.REAPPLY
                    : item.companyPostBanner.status === RequestBannerStatus.PENDING ||
                      item.companyPostBanner.status === RequestBannerStatus.REAPPLY
            )
                status = BannerCompanyBannerStatus.WAITING_FOR_APPROVAL;
            return {
                bannerStatus: status,
                name: item.companyAdvertisingBanner ? item.companyAdvertisingBanner.title : item.companyPostBanner.post.name,
                info: item.companyAdvertisingBanner
                    ? item.companyAdvertisingBanner.urlLink
                    : item.companyPostBanner.post.site?.name || null,
                startDate: item.companyAdvertisingBanner
                    ? item.companyAdvertisingBanner.desiredStartDate
                    : item.companyPostBanner.desiredStartDate,
                endDate: item.companyAdvertisingBanner
                    ? item.companyAdvertisingBanner.desiredEndDate
                    : item.companyPostBanner.desiredEndDate,
                requestDate: item.companyAdvertisingBanner
                    ? item.companyAdvertisingBanner.requestDate
                    : item.companyPostBanner.requestDate,
            };
        });
        const total = await this.prismaService.banner.count({ where: search.where });
        return new PaginationResponse(banner, new PageInfo(total));
    }

    async create(accountId: number, body: BannerCompanyUpsertRequest): Promise<void> {
        if (!body.companyAdvertisingBanner && !body.companyPostBanner)
            throw new BadRequestException('Information for the banner is undefined');
        if (body.companyAdvertisingBanner) {
            const companyId = (await this.prismaService.company.findUnique({ where: { accountId }, select: { id: true } })).id;
            await this.prismaService.banner.create({
                data: {
                    file: {
                        create: body.file,
                    },
                    companyAdvertisingBanner: {
                        create: {
                            urlLink: body.companyAdvertisingBanner.urlLink,
                            desiredEndDate: new Date(body.companyAdvertisingBanner.desiredEndDate),
                            desiredStartDate: new Date(body.companyAdvertisingBanner.desiredStartDate),
                            detail: body.companyAdvertisingBanner.detail,
                            companyId: companyId,
                            title: body.companyAdvertisingBanner.title,
                        },
                    },
                },
            });
        } else {
            await this.prismaService.$transaction(async (prisma) => {
                const bannerId = (
                    await prisma.banner.create({
                        data: {
                            file: {
                                create: body.file,
                            },
                        },
                    })
                ).id;
                await prisma.post.update({
                    where: {
                        id: body.companyPostBanner.postId,
                    },
                    data: {
                        companyPostBanner: {
                            create: {
                                desiredEndDate: new Date(body.companyPostBanner.desiredEndDate),
                                desiredStartDate: new Date(body.companyPostBanner.desiredStartDate),
                                detail: body.companyPostBanner.detail,
                                id: bannerId,
                            },
                        },
                    },
                });
            });
        }
    }

    async getDetail(accountId: number, id: number): Promise<BannerCompanyGetDetailResponse> {
        const banner = await this.prismaService.banner.findUnique({
            where: {
                id,
            },
            select: {
                file: true,
                status: true,
                companyAdvertisingBanner: true,
                companyPostBanner: {
                    select: {
                        desiredEndDate: true,
                        desiredStartDate: true,
                        detail: true,
                        status: true,
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
                    },
                },
            },
        });
        return {
            file: {
                fileName: banner.file.fileName,
                type: banner.file.type,
                key: banner.file.key,
                size: Number(banner.file.size),
            },
            type: banner.companyAdvertisingBanner ? BannerCompanyBannerType.ADVERTISING : BannerCompanyBannerType.POST,
            banner: banner.companyAdvertisingBanner
                ? {
                      title: banner.companyAdvertisingBanner.title,
                      url: banner.companyAdvertisingBanner.urlLink,
                      desiredEndDate: banner.companyAdvertisingBanner.desiredEndDate,
                      desiredStartDate: banner.companyAdvertisingBanner.desiredStartDate,
                      detail: banner.companyAdvertisingBanner.detail,
                      requestStatus: banner.companyAdvertisingBanner.status,
                  }
                : {
                      postName: banner.companyPostBanner.post.name,
                      siteName: banner.companyPostBanner.post.site?.name || null,
                      desiredEndDate: banner.companyPostBanner.desiredEndDate,
                      desiredStartDate: banner.companyPostBanner.desiredStartDate,
                      detail: banner.companyPostBanner.detail,
                      requestStatus: banner.companyPostBanner.status,
                  },
        };
    }
}
