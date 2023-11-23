import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { OtpProvider } from 'domain/entities/otp-provider.entity';

@Injectable()
export abstract class OtpProviderRepository extends BaseRepository<OtpProvider> {
//   abstract createWith(accountId: number, phoneNumber: string): Promise<OtpProvider>;
}
