import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { FileResponse } from 'utils/generics/file.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { AnnouncementAdminCreateRequest } from './request/announcement-admin-create.request';
import { AnnouncementAdminGetListRequest } from './request/announcement-admin-get-list.request';
import { AnnouncementAdminGetDetailResponse } from './response/announcement-admin-get-detail.response';
import { AnnouncementAdminGetListResponse } from './response/announcement-admin-get-list.response';

@Injectable()
export class AnnouncementAdminService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: AnnouncementAdminGetListRequest): Promise<AnnouncementAdminGetListResponse> {
        const queryFilter: Prisma.AnnouncementWhereInput = {
            isActive: true,
            account: {
                isActive: true,
                type: AccountType.ADMIN,
            },
        };
        const records = (
            await this.prismaService.announcement.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    updatedAt: true,
                    title: true,
                    content: true,
                    account: {
                        select: {
                            admin: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                updatedAt: item.updatedAt,
                title: item.title,
                content: item.content,
                name: item.account.admin.name,
            };
        });
        const count = await this.prismaService.announcement.count({
            where: queryFilter,
        });
        return new PaginationResponse(records, new PageInfo(count));
    }
    async getDetail(id: number): Promise<AnnouncementAdminGetDetailResponse> {
        const record = await this.prismaService.announcement.findUnique({
            where: {
                id: id,
                isActive: true,
                account: {
                    isActive: true,
                    admin: {
                        isActive: true,
                    },
                },
            },
            select: {
                title: true,
                content: true,
                announcementFiles: {
                    select: {
                        file: {
                            select: {
                                fileName: true,
                                type: true,
                                size: true,
                                key: true,
                            },
                        },
                    },
                },
                account: {
                    select: {
                        admin: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!record) {
            throw new NotFoundException('The announcement id is not exist');
        }
        return {
            title: record.title,
            content: record.content,
            name: record.account.admin.name,
            files: record.announcementFiles.map((item) => {
                return {
                    fileName: item.file.fileName,
                    type: item.file.type,
                    key: item.file.key,
                    size: Number(item.file.size),
                } as FileResponse;
            }),
        };
    }

    async createAnnouncement(accountId: number, body: AnnouncementAdminCreateRequest) {
        if (body.files && body.files.length > 3) {
            throw new BadRequestException('3 is maxium number of file uploads');
        }
        const admin = await this.prismaService.admin.findUnique({
            where: {
                accountId: accountId,
                isActive: true,
            },
            select: {
                id: true,
            },
        });
        if (!admin) {
            throw new NotFoundException('The admin id is not exist');
        }
        await this.prismaService.$transaction(async (prisma) => {
            const announcement = await prisma.announcement.create({
                data: {
                    title: body.title,
                    content: body.content,
                    accountId: accountId,
                },
                select: {
                    id: true,
                },
            });
            for (const item of body.files) {
                await prisma.file.create({
                    data: {
                        key: item.key,
                        fileName: item.fileName,
                        size: item.size,
                        type: item.type,
                        announcementFile: {
                            create: {
                                anouncementId: announcement.id,
                            },
                        },
                    },
                });
            }
        });
    }
}