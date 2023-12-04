import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { OtpProvider } from 'domain/opt-provider/otp-provider.entity';
import { BaseRepository } from '../../helpers/entity/base.repository';

@Injectable()
export abstract class OtpProviderRepository extends BaseRepository<OtpProvider> {
    abstract findOne(name: string, phoneNumber: string, userName?: string): Promise<OtpProvider>;
    abstract checkOtpValid(phoneNumber: string, otpCode: string): Promise<boolean>;
    abstract getAccountInfo(phoneNumber: string): Promise<Account>;
}
