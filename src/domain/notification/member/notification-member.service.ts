import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AccountType, NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { NotificationMemberGetListRequest } from './request/notification-member-get-list.request';
import { NotificationMemberUpdateRequest } from './request/notification-member-update-request';
import { NotificationMemberGetListResponse } from './response/notification-member-get-list.response';
import { Error } from 'utils/error.enum';

@Injectable()
export class NotificationMemberService {
    constructor(private prismaService: PrismaService) {}
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
                member: true,
            },
        });
        if (!account) {
            return;
        }
        if (account.type === AccountType.MEMBER && account.member) {
            const preference = await this.prismaService.preference.findUnique({
                where: {
                    memberId: account.member.id,
                },
            });
            if (!preference) {
                await this.prismaService.notification.create({
                    data: {
                        title,
                        ...(content && { content }),
                        type,
                        accountId,
                        ...(typeId && { typeId }),
                    },
                });
                console.log('ok');
                return;
            }
            if (!preference.isNoticeNotificationActive) {
                // console.log('Turn off all notifications');
                return;
            }
            if (
                !preference.isServiceNotificationActive &&
                Array<NotificationType>(
                    NotificationType.POST,
                    NotificationType.APPLICATION,
                    NotificationType.INTERVIEW,
                    NotificationType.CONTRACT,
                ).includes(type)
            ) {
                // console.log('turn off POST, APPLICATION, INTERVIEW, CONTACT');
                return;
            }
            if (!preference.isTeamNotificationActive && type === NotificationType.TEAM) {
                // console.log('Turn off Team & Invitation notification');
                return;
            }
            await this.prismaService.notification.create({
                data: {
                    title,
                    ...(content && { content }),
                    type,
                    accountId,
                    ...(typeId && { typeId }),
                },
            });
        }
    }

    async getList(accountId: number, query: NotificationMemberGetListRequest): Promise<NotificationMemberGetListResponse> {
        const queryFilter: Prisma.NotificationWhereInput = {
            account: {
                id: accountId,
                member: {
                    isActive: true,
                },
            },
            isActive: true,
            ...(query.status && { status: query.status }),
        };
        const notifications = await this.prismaService.notification.findMany({
            select: {
                id: true,
                createdAt: true,
                title: true,
                content: true,
                status: true,
            },
            where: queryFilter,
            orderBy: { createdAt: 'desc' },
            ...QueryPagingHelper.queryPaging(query),
        });
        const count = await this.prismaService.notification.count({
            where: queryFilter,
        });
        return new PaginationResponse(notifications, new PageInfo(count));
    }

    async update(accountId: number, id: number, body: NotificationMemberUpdateRequest): Promise<void> {
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
        if (notification.status !== body.status) {
            await this.prismaService.notification.update({
                where: queryFilter,
                data: {
                    status: body.status,
                },
            });
        }
    }

    async delete(accountId: number, id: number): Promise<void> {
        const notification = await this.prismaService.notification.findUnique({
            where: {
                id: id,
                isActive: true,
                account: {
                    id: accountId,
                    member: {
                        isActive: true,
                    },
                },
            },
        });
        if (!notification) {
            throw new NotFoundException(Error.NOTIFICATION_NOT_FOUND);
        }
        await this.prismaService.notification.update({
            where: {
                id: notification.id,
            },
            data: {
                isActive: false,
            },
        });
    }
}
