import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { MemberCareerController } from 'presentation/controllers/member/member-career.controller';
import { CareerUseCase } from 'application/use-cases/career.use-case';
import { CareerUseCaseImpl } from 'infrastructure/use-cases/career.use-case.impl';
import { CareerRepository } from 'domain/repositories/career.repository';
import { CareerRepositoryImpl } from 'infrastructure/repositories/career.repository.impl';
import { MemberModule } from './member.module';

@Module({
  imports: [PrismaModule, MemberModule],
  controllers: [MemberCareerController],
  providers: [
    {
      provide: CareerUseCase,
      useClass: CareerUseCaseImpl,
    },
    {
      provide: CareerRepository,
      useClass: CareerRepositoryImpl,
    },
  ],
  exports: [CareerUseCase, CareerRepository],
})
export class CareerModule {}
