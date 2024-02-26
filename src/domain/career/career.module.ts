import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CareerMemberController } from './member/career-member.controller';
import { CareerMemberService } from './member/career-member.service';
import { GovernmentModule } from '../../services/government/government.module';
import { AccountModule } from 'domain/account/account.module';

@Module({
    imports: [PrismaModule, GovernmentModule, AccountModule],
    controllers: [CareerMemberController],
    providers: [CareerMemberService],
})
export class CareerModule {}
