import { Module } from '@nestjs/common';
import { OtpProviderRepository } from 'domain/opt-provider/otp-provider.repository';
import { OtpProviderRepositoryImpl } from 'domain/opt-provider/otp-provider.repository.impl';
import { PrismaModule } from '../../helpers/entity/prisma.module';

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
