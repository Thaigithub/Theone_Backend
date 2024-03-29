import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AccountType, NotificationStatus, NotificationType, Prisma } from '@prisma/client';
import { PreferenceMemberService } from 'domain/preference/member/preference-member.service';
import { FirebaseService } from 'services/firebase/firebase.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { NotificationMemberGetListRequest } from './request/notification-member-get-list.request';
import {
    NotificationMemberGetListResponse,
    NotificationMemberGetResponse,
} from './response/notification-member-get-list.response';

@Injectable()
export class NotificationMemberService {
    constructor(
        private prismaService: PrismaService,
        private firebaseService: FirebaseService,
        private readonly preferenceMemberService: PreferenceMemberService,
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
                member: true,
            },
        });
        if (!account) {
            return;
        }
        if (account.type === AccountType.MEMBER && account.member) {
            const preference = await this.preferenceMemberService.getDetail(accountId);
            if (preference && !preference.isNoticeNotificationActive) {
                // console.log('Turn off all notifications');
                return;
            }
            if (
                preference &&
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
            if (preference && !preference.isTeamNotificationActive && type === NotificationType.TEAM) {
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
            await this.firebaseService.pushNotification(
                accountId,
                title,
                content,
                type,
                typeId,
                preference.isNotificationSoundActive,
            );
        }
    }

    async getList(accountId: number, query: NotificationMemberGetListRequest): Promise<NotificationMemberGetListResponse> {
        const queryFilter: Prisma.NotificationWhereInput = {
            account: {
                id: accountId,
                OR: [
                    {
                        member: {
                            isActive: true,
                        },
                        company: null,
                    },
                    {
                        company: {
                            isActive: true,
                        },
                        member: null,
                    },
                ],
            },
            isActive: true,
            ...(query.status && { status: query.status }),
        };
        const notifications = (
            await this.prismaService.notification.findMany({
                select: {
                    id: true,
                    createdAt: true,
                    title: true,
                    content: true,
                    status: true,
                    type: true,
                    typeId: true,
                    account: {
                        select: {
                            type: true,
                        },
                    },
                },
                where: queryFilter,
                orderBy: { createdAt: 'desc' },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                createdAt: item.createdAt,
                title: item.title,
                content: item.content,
                status: item.status,
                type: item.type,
                typeId: item.typeId,
                accountType: item.account.type,
            } as NotificationMemberGetResponse;
        });
        const count = await this.prismaService.notification.count({
            where: queryFilter,
        });
        return new PaginationResponse(notifications, new PageInfo(count));
    }

    async update(accountId: number, id: number): Promise<void> {
        const queryFilter: Prisma.NotificationWhereUniqueInput = {
            id: id,
            isActive: true,
            account: {
                id: accountId,
                OR: [
                    {
                        member: {
                            isActive: true,
                        },
                    },
                    {
                        company: {
                            isActive: true,
                        },
                    },
                ],
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

    async delete(accountId: number, id: number): Promise<void> {
        const notification = await this.prismaService.notification.findUnique({
            where: {
                id: id,
                isActive: true,
                account: {
                    id: accountId,
                    OR: [
                        {
                            member: {
                                isActive: true,
                            },
                        },
                        {
                            company: {
                                isActive: true,
                            },
                        },
                    ],
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
