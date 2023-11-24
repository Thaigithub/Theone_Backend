import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AdminTeamManagementController } from 'presentation/controllers/admin/team-management.controller';
import { TeamRepository } from 'domain/repositories/team.repository';
import { TeamRepositoryImpl } from 'infrastructure/repositories/team.repository.impl';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { TeamUseCaseImpl } from 'infrastructure/use-cases/teams.use-case.impl';

@Module({
  imports: [PrismaModule],
  controllers: [AdminTeamManagementController],
  providers: [
    {
      provide: TeamUseCase,
      useClass: TeamUseCaseImpl,
    },
    {
      provide: TeamRepository,
      useClass: TeamRepositoryImpl,
    },
  ],
  exports: [],
})
export class AdminModule {}
