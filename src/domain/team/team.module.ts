import { Module } from '@nestjs/common';
import { AdminTeamController } from 'domain/team/admin/team-admin.controller';
import { ExcelModule } from 'services/excel/excel.module';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AdminTeamService } from './admin/team-admin.service';
import { MemberTeamController } from './member/team-member.controller';
import { MemberTeamService } from './member/team-member.service';
import { TeamCompanyController } from './company/team-company.controller';
import { TeamCompanyService } from './company/team-company.service';

@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [AdminTeamController, MemberTeamController, TeamCompanyController],
    providers: [AdminTeamService, PrismaService, ExcelService, MemberTeamService, TeamCompanyService],
    exports: [AdminTeamService, MemberTeamService, TeamCompanyService],
})
export class TeamModule {}
