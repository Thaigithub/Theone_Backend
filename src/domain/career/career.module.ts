import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CareerMemberController } from './member/career-member.controller';
import { CareerMemberService } from './member/career-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [CareerMemberController],
    providers: [CareerMemberService],
})
export class CareerModule {}
