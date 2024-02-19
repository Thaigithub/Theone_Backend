import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { DeviceMemberController } from './member/device-member.controller';
import { DeviceMemberService } from './member/device-member.service';
import { DeviceCompanyController } from './company/device-company.controller';

@Module({
    imports: [PrismaModule],
    controllers: [DeviceCompanyController, DeviceMemberController],
    providers: [DeviceMemberService],
    exports: [DeviceMemberService],
})
export class DeviceModule {}
