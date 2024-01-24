import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { ReportMemberController } from './member/report-member.controller';
import { ReportMemberService } from './member/report-member.service';
import { ReportAdminController } from './admin/report-admin.controller';
import { ReportAdminService } from './admin/report-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [ReportAdminController, ReportMemberController],
    providers: [ReportAdminService, ReportMemberService],
})
export class ReportModule {}
