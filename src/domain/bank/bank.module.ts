import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { BankMemberController } from './member/bank-member.controller';
import { BankMemberService } from './member/bank-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [BankMemberController],
    providers: [BankMemberService],
})
export class BankModule {}
