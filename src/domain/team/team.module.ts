import { Module } from '@nestjs/common';
import { AdminTeamController } from 'domain/team/admin/team-admin.controller';
import { ExcelModule } from 'services/excel/excel.module';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AdminTeamService } from './admin/team-admin.service';
import { CompanyTeamController } from './company/member-company.controller';
import { CompanyTeamService } from './company/member-company.service';

import { MemberTeamController } from './member/member-team.controller';
import { MemberTeamService } from './member/member-team.service';

@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [AdminTeamController, MemberTeamController, CompanyTeamController],
    providers: [AdminTeamService, PrismaService, ExcelService, MemberTeamService, CompanyTeamService],
    exports: [AdminTeamService, MemberTeamService, CompanyTeamService],
})
export class TeamModule {}
