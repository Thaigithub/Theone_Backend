import { Module } from '@nestjs/common';
import { OtpModule } from 'domain/otp/otp.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AccountAdminController } from './admin/account-admin.controller';
import { AccountAdminService } from './admin/account-admin.service';
import { AccountCompanyController } from './company/account-company.controller';
import { AccountCompanyService } from './company/account-company.service';
import { AccountMemberController } from './member/account-member.controller';
import { AccountMemberService } from './member/account-member.service';

@Module({
    imports: [PrismaModule, OtpModule],
    controllers: [AccountCompanyController, AccountMemberController, AccountAdminController],
    providers: [AccountCompanyService, AccountMemberService, AccountAdminService],
})
export class AccountModule {}
