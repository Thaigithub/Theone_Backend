import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AccountCompanyController } from './company/account-company.controller';
import { AccountCompanyService } from './company/account-company.service';
import { AccountMemberController } from './member/account-member.controller';
import { AccountMemberService } from './member/account-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [AccountCompanyController, AccountMemberController],
    providers: [AccountCompanyService, AccountMemberService],
})
export class AccountModule {}
