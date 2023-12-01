import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { TeamRepository } from 'domain/repositories/team.repository';
import { TeamRepositoryImpl } from 'infrastructure/repositories/team.repository.impl';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { TeamUseCaseImpl } from 'infrastructure/use-cases/team.use-case.impl';
import { AdminTeamController } from 'presentation/controllers/admin/admin-team.controller';
import { ExcelService } from 'infrastructure/services/excel.service';

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
