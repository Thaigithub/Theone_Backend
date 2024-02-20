import { Injectable } from '@nestjs/common';
import { AccountStatus, AccountType, NotificationType } from '@prisma/client';
import { FirebaseService } from 'services/firebase/firebase.service';
import { PrismaService } from '../../../services/prisma/prisma.service';

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
            await this.firebaseService.pushNotification(accountId, title, content, type, typeId, undefined);
        } else {
            return;
        }
    }
}
