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
            };
        });
        return { advertising: advertising, post: post };
    }
}
