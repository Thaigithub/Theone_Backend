import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { MemberLicenseController } from './member/license-member.controller';
import { LicenseService } from './member/license-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [MemberLicenseController],
    providers: [LicenseService],
})
export class LicenseModule {}
