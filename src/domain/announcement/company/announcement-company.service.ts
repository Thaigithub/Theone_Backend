import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { AnnouncementCompanyGetListRequest } from './request/announcement-company-get-list.request';
import { AnnouncementCompanyGetDetailResponse } from './response/announcement-company-get-detail.response';
import { AnnouncementCompanyGetListResponse } from './response/announcement-company-get-list.response';

@Injectable()
export class AnnouncementCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: AnnouncementCompanyGetListRequest): Promise<AnnouncementCompanyGetListResponse> {
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

    async getDetail(id: number): Promise<AnnouncementCompanyGetDetailResponse> {
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

        if (!announcement) throw new NotFoundException('Announcement does not exist');

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
