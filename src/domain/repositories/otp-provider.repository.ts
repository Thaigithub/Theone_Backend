import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { OtpProvider } from 'domain/entities/otp-provider.entity';
import { Account } from '@prisma/client';

@Injectable()
export abstract class OtpProviderRepository extends BaseRepository<OtpProvider> {
     abstract findOne(name:string,phoneNumber:string,userName?:string):Promise<OtpProvider>
     abstract checkOtpValid(phoneNumber:string,otpCode:string):Promise<boolean>
     abstract getAccountInfo(phoneNumber:string):Promise<Account>
}
