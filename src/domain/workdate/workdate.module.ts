import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { WorkDateMemberController } from './member/workdate-member.controller';
import { WorkDateMemberService } from './member/workdate-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [WorkDateMemberController],
    providers: [WorkDateMemberService],
})
export class WorkDateModule {}
