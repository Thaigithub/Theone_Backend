import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository.impl';
import { Team } from '@prisma/client';
import { TeamRepository } from 'domain/repositories/team.repository';
import { PrismaService } from 'infrastructure/services/prisma.service';
import { PrismaModel } from 'domain/entities/prisma.model';

@Injectable()
export class TeamRepositoryImpl extends BaseRepositoryImpl<Team> implements TeamRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.TEAM);
  }
}
