import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { MemoMemberController } from './member/memo-member.controller';
import { MemoMemberService } from './member/memo-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [MemoMemberController],
    providers: [MemoMemberService],
})
export class MemoModule {}
