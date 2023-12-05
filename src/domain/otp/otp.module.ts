import { Module } from '@nestjs/common';

import { SmsModule } from 'services/sms/sms.module';
import { SmsService } from 'services/sms/sms.service';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { OtpService } from './otp.service';

@Module({
    imports: [PrismaModule, SmsModule],
    providers: [OtpService, SmsService],
    exports: [OtpService],
})
export class OtpModule {}
