import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AccountType, NotificationStatus, NotificationType, Prisma } from '@prisma/client';
import { FirebaseService } from 'services/firebase/firebase.service';
import { Error } from 'utils/error.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { QueryPagingHelper } from '../../../utils/pagination-query';
import { CompanyGetNotificationResponse, NotificationCompanyGetListResponse } from './response/company-notification.response';

@Injectable()
export class NotificationCompanyService {
    constructor(
        private prismaService: PrismaService,
        private firebaseService: FirebaseService,
    ) {}

    async create(
        accountId: number,
        title: string,
        content: string | undefined,
        type: NotificationType,
        typeId: number | undefined,
    ) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                status: AccountStatus.APPROVED,
            },
            select: {
                type: true,
                company: true,
            },
        });
        if (!account) {
            return;
        }
        if (account.type === AccountType.COMPANY && account.company) {
            await this.prismaService.notification.create({
                data: {
                    title,
                    ...(content && { content }),
                    type,
                    accountId,
                    ...(typeId && { typeId }),
                },
            });
            await this.firebaseService.pushNotification(accountId, title, content, type, typeId);
        } else {
            return;
        }
    }

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
                    typeId: item.typeId,
                }) as CompanyGetNotificationResponse,
        );
        const countNotification = await this.prismaService.notification.count({
            where: queryFilter,
        });

        return new PaginationResponse(mappedResult, new PageInfo(countNotification));
    }

    async update(accountId: number, id: number): Promise<void> {
        const queryFilter: Prisma.NotificationWhereUniqueInput = {
            id: id,
            isActive: true,
            account: {
                id: accountId,
                member: {
                    isActive: true,
                },
            },
        };
        const notification = await this.prismaService.notification.findUnique({
            where: queryFilter,
            select: {
                status: true,
            },
        });
        if (!notification) {
            throw new NotFoundException(Error.NOTIFICATION_NOT_FOUND);
        }
        if (notification.status === NotificationStatus.NOT_READ) {
            await this.prismaService.notification.update({
                where: queryFilter,
                data: {
                    status: NotificationStatus.READ,
                },
            });
        }
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
            throw new NotFoundException(Error.NOTIFICATION_NOT_FOUND);
        }
        await this.prismaService.notification.update({
            where: queryFilter,
            data: {
                isActive: false,
            },
        });
    }
}
