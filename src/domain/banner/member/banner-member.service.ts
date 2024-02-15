import { Injectable } from '@nestjs/common';
import { BannerStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { StorageService } from 'services/storage/storage.service';
import { BannerMemberGetListResponse } from './response/banner-member-get-list.response';

@Injectable()
export class BannerMemberService {
    constructor(
        private prismaService: PrismaService,
        private storageService: StorageService,
    ) {}
    async getList(accountId: number): Promise<BannerMemberGetListResponse> {
        const advertising = await Promise.all(
            (
                await this.prismaService.advertisingBanner.findMany({
                    where: {
                        banner: {
                            isActive: true,
                            status: BannerStatus.EXPOSE,
                        },
                    },
                    orderBy: {
                        priority: 'asc',
                    },
                    select: {
                        banner: {
                            select: {
                                file: true,
                            },
                        },
                        urlLink: true,
                        title: true,
                        request: {
                            select: {
                                company: {
                                    select: {
                                        logo: {
                                            select: {
                                                fileName: true,
                                                key: true,
                                                type: true,
                                                size: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                })
            ).map(async (item) => {
                return {
                    file: {
                        fileName: item.banner.file.fileName,
                        key: item.banner.file.key,
                        type: item.banner.file.type,
                        size: Number(item.banner.file.size),
                    },
                    logoFile: item.request?.company.logo
                        ? {
                              fileName: item.request?.company.logo.fileName,
                              key: item.request.company.logo.fileName,
                              type: item.request.company.logo.type,
                              size: Number(item.request.company.logo.size),
                          }
                        : null,
                    urlLink: item.urlLink,
                    title: item.title,
                    urlFile: await this.storageService.getSignedUrl(item.banner.file.key),
                };
            }),
        );
        const post = await Promise.all(
            (
                await this.prismaService.postBanner.findMany({
                    where: {
                        banner: {
                            isActive: true,
                            status: BannerStatus.EXPOSE,
                        },
                        post: {
                            isActive: true,
                        },
                    },
                    orderBy: {
                        priority: 'asc',
                    },
                    select: {
                        banner: {
                            select: {
                                file: true,
                            },
                        },
                        postId: true,
                        post: {
                            select: {
                                name: true,
                                endDate: true,
                                site: {
                                    select: {
                                        name: true,
                                        address: true,
                                    },
                                },
                                company: {
                                    select: {
                                        logo: {
                                            select: {
                                                fileName: true,
                                                key: true,
                                                type: true,
                                                size: true,
                                            },
                                        },
                                    },
                                },
                                interests: {
                                    where: {
                                        member: {
                                            accountId,
                                            isActive: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                })
            ).map(async (item) => {
                return {
                    file: {
                        fileName: item.banner.file.fileName,
                        key: item.banner.file.key,
                        type: item.banner.file.type,
                        size: Number(item.banner.file.size),
                    },
                    postId: item.postId,
                    logoFile: item.post.company.logo
                        ? {
                              fileName: item.post.company.logo.fileName,
                              key: item.post.company.logo.key,
                              size: Number(item.post.company.logo.size),
                              type: item.post.company.logo.type,
                          }
                        : null,
                    endDate: item.post.endDate,
                    siteName: item.post.site?.name || null,
                    siteAddress: item.post.site?.address || null,
                    postName: item.post.name,
                    isInterested: accountId ? (item.post.interests.length !== 0 ? true : false) : null,
                    urlFile: await this.storageService.getSignedUrl(item.banner.file.key),
                    urlLogo: await this.storageService.getSignedUrl(item.post.company.logo.key),
                };
            }),
        );
        return { advertising: advertising, post: post };
    }
}
