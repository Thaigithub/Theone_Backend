import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { SMS_OTP_VALID_TIME } from 'app.config';
import { OtpProvider } from 'domain/opt-provider/otp-provider.entity';
import { OtpProviderRepository } from 'domain/opt-provider/otp-provider.repository';
import { PrismaModel } from 'helpers/entity/prisma.model';
import { PrismaService } from 'helpers/entity/prisma.service';
import { BaseRepositoryImpl } from '../../helpers/entity/base.repository.impl';

@Injectable()
export class OtpProviderRepositoryImpl extends BaseRepositoryImpl<OtpProvider> implements OtpProviderRepository {
    constructor(private readonly prismaService: PrismaService) {
        super(prismaService, PrismaModel.OTP_PROVIDER);
    }
    async getAccountInfo(phoneNumber: string): Promise<Account> {
        // const otpProvider =await this.prismaService.otpProvider.findUnique({
        //   where:{
        //     phoneNumber,
        //   },
        //   include:{
        //     account: true,
        //   }
        // });
        // if (otpProvider) {
        //   return otpProvider.account;
        // } else {
        //   return null;
        // }
        return;
    }
    async checkOtpValid(phoneNumber: string, otpCode: string): Promise<boolean> {
        const otpProvider = await this.prismaService.otpProvider.findFirst({
            where: {
                otpCode: otpCode,
            },
        });

        if (!otpProvider) {
            return false;
        }
        const updatedAt = otpProvider.updatedAt;
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - updatedAt.getTime();
        const timeDifferenceInMinutes = timeDifference / (1000 * 60);
        return timeDifferenceInMinutes <= parseInt(SMS_OTP_VALID_TIME, 10);
    }
    async findOne(name: string, phoneNumber: string, userName?: string): Promise<OtpProvider> {
        const query = {
            where: {
                account: {},
                phoneNumber: phoneNumber,
            },
            include: {
                account: true,
            },
        };
        // if (userName) {
        //   query.where.account['username'] = userName;
        // }
        return await this.prismaService.otpProvider.findFirst(query);
    }
}
