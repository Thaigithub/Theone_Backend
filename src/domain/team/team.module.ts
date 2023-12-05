import { Module } from '@nestjs/common';
import { AdminTeamController } from 'domain/team/admin/admin-team.controller';
import { ExcelModule } from 'services/excel/excel.module';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { TeamService } from './team.service';

@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [AdminTeamController],
    providers: [TeamService, PrismaService, ExcelService],
    exports: [TeamService],
})
export class TeamModule {}
