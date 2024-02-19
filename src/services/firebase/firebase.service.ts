import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { FIRE_BASE_CLIENT_EMAIL, FIRE_BASE_PRIVATE_KEY, FIRE_BASE_PROJECT_ID } from 'app.config';
import * as firebase from 'firebase-admin';
import { PrismaService } from 'services/prisma/prisma.service';

firebase.initializeApp({
    credential: firebase.credential.cert({
        project_id: FIRE_BASE_PROJECT_ID,
        client_email: FIRE_BASE_CLIENT_EMAIL,
        private_key: FIRE_BASE_PRIVATE_KEY,
    } as firebase.ServiceAccount),
});

@Injectable()
export class FirebaseService {
    constructor(private prismaService: PrismaService) {}

    async pushNotification(
        accountId: number,
        title: string,
        content: string,
        type: NotificationType,
        typeId: number,
    ): Promise<void> {
        const tokens = await this.prismaService.device.findMany({
            where: {
                accountId,
                isActive: true,
            },
            select: {
                token: true,
                account: {
                    select: {
                        type: true,
                    },
                },
            },
        });
        for (const item of tokens) {
            await firebase.messaging().send({
                data: {
                    type: type,
                    typeId: typeId.toString(),
                    accountType: item.account.type,
                },
                notification: {
                    title,
                    body: content,
                },
                webpush: {
                    data: {
                        type: type,
                        typeId: typeId.toString(),
                        accountType: item.account.type,
                    },
                    notification: {
                        title,
                        body: content,
                    },
                },
                token: item.token,
            });
        }
    }
}
