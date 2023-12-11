import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { MemberSpecialLicenseController } from './member/special-license-member.controller';
import { SpecialLicenseService } from './member/special-license-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [MemberSpecialLicenseController],
    providers: [SpecialLicenseService],
    exports: [SpecialLicenseService],
})
export class SpecialLicenseModule {}
