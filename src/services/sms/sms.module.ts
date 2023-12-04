import { Module } from '@nestjs/common';
import { OtpService } from 'services/sms/sms.service';

@Module({
    providers: [OtpService],
    exports: [OtpService],
})
export class OtpModule {}
