import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { AnnouncementGuestGetListRequest } from './request/announcement-guest-get-list.request';
import { AnnouncementGuestGetDetailResponse } from './response/announcement-guest-get-detail.response';
import { AnnouncementGuestGetListResponse } from './response/announcement-guest-get-list.response';

@Injectable()
export class AnnouncementGuestService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: AnnouncementGuestGetListRequest): Promise<AnnouncementGuestGetListResponse> {
        const queryFilter: Prisma.AnnouncementWhereInput = {
            isActive: true,
            ...(query.keyword && {
                OR: [
                    { title: { contains: query.keyword, mode: 'insensitive' } },
                    {
                        account: {
                            admin: {
                                name: { contains: query.keyword, mode: 'insensitive' },
                            },
                        },
                    },
                ],
            }),
        };
        const announcements = (
            await this.prismaService.announcement.findMany({
                include: {
                    announcementFiles: {
                        where: {
                            isActive: true,
                        },
                        include: {
                            file: true,
                        },
                    },
                    account: {
                        include: {
                            admin: true,
                        },
                    },
                },
                where: queryFilter,
                ...QueryPagingHelper.queryPaging(query),
                orderBy: {
                    createdAt: 'desc',
                },
            })
        ).map((item) => {
            return {
                id: item.id,
                createdAt: item.createdAt,
                title: item.title,
                content: item.content,
                name: item.account.admin.name,
                files: item.announcementFiles.map((fileItem) => {
                    return {
                        fileName: fileItem.file.fileName,
                        type: fileItem.file.type,
                        key: fileItem.file.key,
                        size: Number(fileItem.file.size),
                    };
                }),
            };
        });

        const total = await this.prismaService.announcement.count({ where: queryFilter });

        return new PaginationResponse(announcements, new PageInfo(total));
    }

    async getDetail(id: number): Promise<AnnouncementGuestGetDetailResponse> {
        const announcement = await this.prismaService.announcement.findUnique({
            where: {
                id: id,
                isActive: true,
            },
            include: {
                announcementFiles: {
                    where: {
                        isActive: true,
                    },
                    include: {
                        file: true,
                    },
                },
                account: {
                    include: {
                        admin: true,
                    },
                },
            },
        });

        if (!announcement) throw new NotFoundException(Error.ANNOUNCEMENT_NOT_FOUND);

        return {
            id: announcement.id,
            createdAt: announcement.updatedAt,
            title: announcement.title,
            content: announcement.content,
            name: announcement.account.admin.name,
            files: announcement.announcementFiles.map((item) => {
                return {
                    fileName: item.file.fileName,
                    type: item.file.type,
                    key: item.file.key,
                    size: Number(item.file.size),
                };
            }),
        };
    }
}
