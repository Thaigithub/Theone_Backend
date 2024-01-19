import { Module } from '@nestjs/common';
import { MailModule } from 'services/mail/mail.module';
import { PrismaModule } from 'services/prisma/prisma.module';
import { OtpService } from './otp.service';

@Module({
    imports: [PrismaModule, MailModule],
    providers: [OtpService],
    exports: [OtpService],
})
export class OtpModule {}
