import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AdminMemberController } from 'presentation/controllers/admin-member.controller';
import { AdminMemberUseCase } from 'application/use-cases/member.use-case';
import { AdminMemberUseCaseImpl } from 'infrastructure/use-cases/member.use-case.impl';
import { AdminMemberRepository } from 'domain/repositories/member.repository';
import { AdminMemberRepositoryImpl } from 'infrastructure/repositories/member.repository.impl';

@Module({
  imports: [PrismaModule],
  controllers: [AdminMemberController],
  providers: [
    {
      provide: AdminMemberUseCase,
      useClass: AdminMemberUseCaseImpl,
    },
    {
      provide: AdminMemberRepository,
      useClass: AdminMemberRepositoryImpl,
    },
  ],
  exports: [AdminMemberUseCase, AdminMemberRepository],
})
export class AdminMemberModule {}
