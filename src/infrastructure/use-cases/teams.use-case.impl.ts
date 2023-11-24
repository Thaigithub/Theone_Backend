import { Inject, Injectable } from '@nestjs/common';
import { TeamDTO } from 'application/dtos/team.dto';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { TeamRepository } from 'domain/repositories/team.repository';

@Injectable()
export class TeamUseCaseImpl implements TeamUseCase {
  constructor(@Inject(TeamRepository) private readonly teamRepository: TeamRepository) {}
  searchTeams(): Promise<TeamDTO[]> {
    throw new Error('Method not implemented.');
  }
}
