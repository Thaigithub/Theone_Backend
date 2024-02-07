import { Module } from '@nestjs/common';
import { NotificationModule } from 'domain/notification/notification.module';
import { ExcelModule } from 'services/excel/excel.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { TeamAdminController } from './admin/team-admin.controller';
import { TeamAdminService } from './admin/team-admin.service';
import { TeamCompanyController } from './company/team-company.controller';
import { TeamCompanyService } from './company/team-company.service';
import { TeamMemberController } from './member/team-member.controller';
import { TeamMemberService } from './member/team-member.service';

@Module({
    imports: [PrismaModule, ExcelModule, NotificationModule],
    controllers: [TeamAdminController, TeamMemberController, TeamCompanyController],
    providers: [TeamAdminService, TeamMemberService, TeamCompanyService],
    exports: [TeamCompanyService],
})
export class TeamModule {}
