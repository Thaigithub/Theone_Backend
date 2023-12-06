import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AccountAdminController } from './admin/account-admin.controller';
import { AccountAdminService } from './admin/account-admin.service';
import { AccountCompanyController } from './company/account-company.controller';
import { AccountCompanyService } from './company/account-company.service';
import { AccountMemberController } from './member/account-member.controller';
import { AccountMemberService } from './member/account-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [AccountAdminController, AccountCompanyController, AccountMemberController],
    providers: [AccountAdminService, AccountCompanyService, AccountMemberService],
})
export class AccountModule {}
