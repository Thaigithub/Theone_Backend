import { Module } from '@nestjs/common';
import { OtpService } from 'infrastructure/services/sms.service';

@Module({
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
