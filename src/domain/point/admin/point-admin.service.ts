import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PointStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { FileResponse } from 'utils/generics/file.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PointAdminCategoryFilter } from './enum/point-admin-category-filter';
import { PointAdminGetListRequest } from './request/point-admin-get-list.request';
import { PointAdminUpdateRequest } from './request/point-admin-update.request';
import { PointAdminGetListResponse } from './response/point-admin-get-list.response';
import { Error } from 'utils/error.enum';

@Injectable()
export class PointAdminService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: PointAdminGetListRequest): Promise<PointAdminGetListResponse> {
        const queryFilter: Prisma.PointWhereInput = {
            ...(query.status &&
                !query.startDate &&
                !query.endDate && {
                    status: query.status,
                }),
            ...((query.startDate || query.endDate) && {
                status: PointStatus.APPROVED,
                updateAt: {
                    gte: query.startDate ? new Date(query.startDate).toISOString() : undefined,
                    lte: query.endDate ? new Date(query.endDate).toISOString() : undefined,
                },
            }),
            member: {
                isActive: true,
                ...(query.category === PointAdminCategoryFilter.NAME &&
                    query.keyword && {
                        name: { contains: query.keyword, mode: 'insensitive' },
                    }),
                ...(query.category === PointAdminCategoryFilter.CONTACT &&
                    query.keyword && {
                        contact: { contains: query.keyword, mode: 'insensitive' },
                    }),
                ...(!query.category &&
                    query.keyword && {
                        OR: [
                            { name: { contains: query.keyword, mode: 'insensitive' } },
                            { contact: { contains: query.keyword, mode: 'insensitive' } },
                        ],
                    }),
            },
        };

        const points = (
            await this.prismaService.point.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    member: {
                        select: {
                            name: true,
                            contact: true,
                        },
                    },
                    updatedAt: true,
                    status: true,
                    file: true,
                },
                orderBy: {
                    updatedAt: 'desc',
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                name: item.member.name,
                contact: item.member.contact,
                completeAt: item.status === PointStatus.APPROVED ? item.updatedAt : null,
                status: item.status,
                file: {
                    fileName: item.file.fileName,
                    size: Number(item.file.size),
                    type: item.file.type,
                    key: item.file.key,
                } as FileResponse,
            };
        });
        const count = await this.prismaService.point.count({
            where: queryFilter,
        });
        return new PaginationResponse(points, new PageInfo(count));
    }

    async update(id: number, body: PointAdminUpdateRequest): Promise<void> {
        const point = await this.prismaService.point.findUnique({
            where: {
                id: id,
                member: {
                    isActive: true,
                },
            },
            select: {
                status: true,
                member: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!point) {
            throw new NotFoundException(Error.POINT_REQUEST_NOT_FOUND);
        }
        if (body.status === PointStatus.APPROVED && !body.amount) {
            throw new BadRequestException(Error.POINT_MUST_GREATER_THAN_0);
        }
        if (body.status === PointStatus.REJECTED && !body.reason) {
            throw new BadRequestException(Error.REASON_IS_REQUIRED);
        }
        if (point.status === PointStatus.REQUESTING) {
            await this.prismaService.$transaction(async (prisma) => {
                const record = await prisma.point.update({
                    where: {
                        id: id,
                    },
                    data: {
                        status: body.status,
                        ...(body.status === PointStatus.APPROVED && {
                            amount: body.amount,
                            ...(body.reason && { reason: body.reason }),
                            member: {
                                update: {
                                    data: {
                                        totalPoint: { increment: body.amount },
                                    },
                                },
                            },
                        }),
                        ...(body.reason && {
                            reason: body.reason,
                        }),
                    },
                    select: {
                        member: {
                            select: {
                                totalPoint: true,
                            },
                        },
                    },
                });
                if (body.status === PointStatus.APPROVED) {
                    await prisma.point.update({
                        where: {
                            id: id,
                        },
                        data: {
                            remainAmount: record.member.totalPoint,
                        },
                    });
                }
            });
        }
    }
}
