import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { MemberMemberController } from 'presentation/controllers/member/member-member.controller';
import { AdminMemberController } from 'presentation/controllers/admin/admin-member.controller';
import { MemberUseCase } from 'application/use-cases/member.use-case';
import { MemberUseCaseImpl } from 'infrastructure/use-cases/member.use-case.impl';
import { MemberRepository } from 'domain/repositories/member.repository';
import { MemberRepositoryImpl } from 'infrastructure/repositories/member.repository.impl';
@Module({
  imports: [PrismaModule],
  controllers: [AdminMemberController, MemberMemberController],
  providers: [
    {
      provide: MemberUseCase,
      useClass: MemberUseCaseImpl,
    },
    {
      provide: MemberRepository,
      useClass: MemberRepositoryImpl,
    },
  ],
  exports: [MemberUseCase, MemberRepository],
})
export class MemberModule {}
