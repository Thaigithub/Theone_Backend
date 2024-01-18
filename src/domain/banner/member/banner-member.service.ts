import { Injectable } from '@nestjs/common';
import { BannerStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { BannerMemberGetListResponse } from './response/banner-member-get-list.response';

@Injectable()
export class BannerMemberService {
    constructor(private prismaService: PrismaService) {}
    async getList(): Promise<BannerMemberGetListResponse> {
        const advertising = (
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
                                            file: {
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
                    },
                },
            })
        ).map((item) => {
            return {
                file: {
                    fileName: item.banner.file.fileName,
                    key: item.banner.file.key,
                    type: item.banner.file.type,
                    size: Number(item.banner.file.size),
                },
                logoFile: item.request?.company.logo?.file
                    ? {
                          fileName: item.request?.company.logo.file.fileName,
                          key: item.request.company.logo.file.fileName,
                          type: item.request.company.logo.file.type,
                          size: Number(item.request.company.logo.file.size),
                      }
                    : null,
                urlLink: item.urlLink,
                title: item.title,
            };
        });
        const post = (
            await this.prismaService.postBanner.findMany({
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
                    postId: true,
                    post: {
                        select: {
                            company: {
                                select: {
                                    logo: {
                                        select: {
                                            file: {
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
                    },
                },
            })
        ).map((item) => {
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
                          fileName: item.post.company.logo.file.fileName,
                          key: item.post.company.logo.file.key,
                          size: Number(item.post.company.logo.file.size),
                          type: item.post.company.logo.file.type,
                      }
                    : null,
            };
        });
        return { advertising: advertising, post: post };
    }
}
