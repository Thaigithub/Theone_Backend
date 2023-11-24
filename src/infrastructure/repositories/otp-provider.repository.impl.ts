import { Injectable } from '@nestjs/common';
import { OtpProvider } from 'domain/entities/otp-provider.entity';
import { BaseRepositoryImpl } from './base.repository.impl';
import { OtpProviderRepository } from 'domain/repositories/otp-provider.repository';
import { PrismaService } from 'infrastructure/services/prisma.service';
import { PrismaModel } from 'domain/entities/prisma.model';
import { Account } from '@prisma/client';
import { SMS_OTP_VALID_TIME } from 'app.config';

@Injectable()
export class OtpProviderRepositoryImpl extends BaseRepositoryImpl<OtpProvider> implements OtpProviderRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.OTP_PROVIDER);
  }
   async getAccountInfo(phoneNumber: string): Promise<Account> {
    const otpProvider =await this.prismaService.otpProvider.findUnique({
      where:{
        phoneNumber,
      },
      include:{
        account: true,
      }
    });
    if (otpProvider) {
      return otpProvider.account;
    } else {
      return null; 
    }
  }
  async checkOtpValid(phoneNumber: string, otpCode: string): Promise<boolean> {
    const otpProvider = await this.prismaService.otpProvider.findFirst({
      where: {
        phoneNumber: phoneNumber,
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
    return timeDifferenceInMinutes <= parseInt(SMS_OTP_VALID_TIME,10);
    
  }
  async findOne(name: string, phoneNumber: string, userName?: string): Promise<OtpProvider> {
  
    const query = {
      where: {
        account: {
          name: name,
        },
        phoneNumber: phoneNumber,
      },
      include: {
        account: true,
      },
    };
    if (userName) {
      query.where.account['username'] = userName;
    }
    return await this.prismaService.otpProvider.findFirst(query);
  }
}
