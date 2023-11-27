import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { MemberMemberController } from 'presentation/controllers/member-member.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MemberMemberController],
  providers: [
    {
        provide:,
        useClass:
    }
  ],
  exports: [],
})
export class MemberMemberModule {}
