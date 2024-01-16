import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PORTONE_API_KEY, PORTONE_API_SECRET, PORTONE_HOST } from 'app.config';
import axios from 'axios';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class PortoneService {
    private prismaService: PrismaService;
    private access_token: string;
    private async login(): Promise<void> {
        this.access_token = (
            await axios({
                url: `${PORTONE_HOST}/users/getToken`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    imp_key: `${PORTONE_API_KEY}`,
                    imp_secret: `${PORTONE_API_SECRET}`,
                },
            })
        ).data.response.access_token;
    }
    async createPayment(amount: number, merchant_uid: string): Promise<void> {
        await this.login();
        await axios({
            url: `${PORTONE_HOST}/payments/prepare`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.access_token}`,
            },
            data: {
                merchant_uid: merchant_uid,
                amount: amount,
            },
        });
    }

    async verifyPayment(imp_uid: string, merchantId: string): Promise<boolean> {
        await this.login();
        const data = (
            await axios({
                url: `${PORTONE_HOST}/payments/${imp_uid}`,
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.access_token}`,
                },
            })
        ).data;
        const { amount, merchant_uid, status } = data;
        if (status === 'paid') {
            const payment = await this.prismaService.productPaymentHistory.findUnique({
                where: {
                    merchantId: merchant_uid,
                    cost: amount,
                    isActive: true,
                    status: PaymentStatus.PROCESSING,
                },
                select: {
                    product: true,
                    merchantId: true,
                    id: true,
                },
            });
            if (payment) {
                if (payment.merchantId === merchantId) {
                    const expirationDate = new Date();
                    expirationDate.setMonth(new Date().getMonth() + payment.product.monthLimit);
                    await this.prismaService.productPaymentHistory.update({
                        where: {
                            id: payment.id,
                        },
                        data: {
                            status: PaymentStatus.COMPLETE,
                            expirationDate: expirationDate,
                        },
                    });
                    return true;
                }
            }
        }
    }
}
