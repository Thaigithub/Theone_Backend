import { Module } from '@nestjs/common';
import { AdminTeamController } from 'domain/team/admin-team.controller';
import { TeamRepository } from 'domain/team/team.repository';
import { TeamRepositoryImpl } from 'domain/team/team.repository.impl';
import { TeamUseCase } from 'domain/team/team.usecase';
import { TeamUseCaseImpl } from 'domain/team/team.usecase.impl';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaModule } from '../../helpers/entity/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdminTeamController],
    providers: [
        {
            provide: TeamUseCase,
            useClass: TeamUseCaseImpl,
        },
        {
            provide: TeamRepository,
            useClass: TeamRepositoryImpl,
        },
        ExcelService,
    ],
    exports: [TeamUseCase],
})
export class TeamModule {}
