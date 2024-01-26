import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { FileResponse } from 'utils/generics/file.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { AnnouncementAdminCreateRequest } from './request/announcement-admin-create.request';
import { AnnouncementAdminGetListRequest } from './request/announcement-admin-get-list.request';
import { AnnouncementAdminUpdateRequest } from './request/announcement-admin-update.request';
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
                orderBy: {
                    updatedAt: 'desc',
                },
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
                    where: {
                        isActive: true,
                    },
                    select: {
                        id: true,
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
            announcementFiles: record.announcementFiles.map((item) => {
                return {
                    id: item.id,
                    file: {
                        fileName: item.file.fileName,
                        type: item.file.type,
                        key: item.file.key,
                        size: Number(item.file.size),
                    } as FileResponse,
                };
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

    async update(accountId: number, id: number, body: AnnouncementAdminUpdateRequest): Promise<void> {
        const record = await this.prismaService.announcement.findUnique({
            where: {
                id: id,
                isActive: true,
            },
            select: {
                announcementFiles: {
                    where: {
                        isActive: true,
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!record) {
            throw new NotFoundException('The announcement is not found');
        }

        const ids =
            body.removeFileIds && body.removeFileIds.length > 0
                ? record.announcementFiles.filter((file) => body.removeFileIds.includes(file.id)).map((item) => item.id)
                : null;
        const maximumFiles = record.announcementFiles.length + body.files.length - (ids ? ids.length : 0);
        if (maximumFiles > 3) {
            throw new ConflictException('Maximum number of files is 3');
        }
        await this.prismaService.$transaction(async (prisma) => {
            await prisma.announcement.update({
                where: {
                    id: id,
                    isActive: true,
                },
                data: {
                    title: body.title,
                    content: body.content,
                    accountId: accountId,
                    ...(ids &&
                        ids.length > 0 && {
                            announcementFiles: {
                                updateMany: {
                                    where: {
                                        id: { in: ids },
                                    },
                                    data: {
                                        isActive: false,
                                    },
                                },
                            },
                        }),
                },
            });
            for (const file of body.files) {
                await prisma.announcementFile.create({
                    data: {
                        announcement: {
                            connect: {
                                id,
                            },
                        },
                        file: {
                            create: {
                                fileName: file.fileName,
                                size: file.size,
                                key: file.key,
                                type: file.type,
                            },
                        },
                    },
                });
            }
        });
    }

    async delete(accountId: number, id: number): Promise<void> {
        const announcement = await this.prismaService.announcement.findUnique({
            where: {
                id: id,
                isActive: true,
            },
        });
        if (!announcement) {
            throw new NotFoundException('The announcement has been deleted');
        }
        await this.prismaService.$transaction(async (prisma) => {
            await prisma.announcement.update({
                where: {
                    id: id,
                    isActive: true,
                },
                data: {
                    isActive: false,
                    accountId: accountId,
                    announcementFiles: {
                        updateMany: {
                            where: {
                                isActive: true,
                            },
                            data: {
                                isActive: false,
                            },
                        },
                    },
                },
            });
        });
    }
}
