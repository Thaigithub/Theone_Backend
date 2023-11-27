import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { OtpProviderRepository } from 'domain/repositories/otp-provider.repository';
import { OtpProviderRepositoryImpl } from 'infrastructure/repositories/otp-provider.repository.impl';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: OtpProviderRepository,
      useClass: OtpProviderRepositoryImpl,
    },
  ],
  exports: [OtpProviderRepository],
})
export class OtpProviderModule {}
