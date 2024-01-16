import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { QueryPagingHelper } from '../../../utils/pagination-query';
import { CompanyGetNotificationResponse, NotificationCompanyGetListResponse } from './response/company-Notification.response';

@Injectable()
export class NotificationCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: PaginationRequest, accountId: number): Promise<NotificationCompanyGetListResponse> {
        const queryFilter: Prisma.NotificationWhereInput = {
            account: {
                id: accountId,
                isActive: true,
            },
            isActive: true,
        };
        const notifications = await this.prismaService.notification.findMany({
            where: queryFilter,
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const mappedResult = notifications.map(
            (item) =>
                ({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    type: item.type,
                }) as CompanyGetNotificationResponse,
        );
        const countNotification = await this.prismaService.notification.count({
            where: queryFilter,
        });

        return new PaginationResponse(mappedResult, new PageInfo(countNotification));
    }

    async delete(id: number, accountId: number): Promise<void> {
        const queryFilter: Prisma.NotificationWhereUniqueInput = {
            id: id,
            account: {
                id: accountId,
                isActive: true,
            },
            isActive: true,
        };
        const notification = await this.prismaService.notification.findUnique({
            where: queryFilter,
            select: {
                isActive: true,
            },
        });
        if (!notification) {
            throw new NotFoundException('The Notification is not found');
        }
        await this.prismaService.notification.update({
            where: queryFilter,
            data: {
                isActive: false,
            },
        });
    }
}
