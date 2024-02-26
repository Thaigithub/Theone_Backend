import { Module } from '@nestjs/common';
import { OtpModule } from 'domain/otp/otp.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AccountAdminController } from './admin/account-admin.controller';
import { AccountAdminService } from './admin/account-admin.service';
import { AccountCompanyController } from './company/account-company.controller';
import { AccountCompanyService } from './company/account-company.service';
import { AccountMemberController } from './member/account-member.controller';
import { AccountMemberService } from './member/account-member.service';
import { NotificationModule } from 'domain/notification/notification.module';

@Module({
    imports: [PrismaModule, OtpModule, NotificationModule],
    controllers: [AccountCompanyController, AccountMemberController, AccountAdminController],
    providers: [AccountCompanyService, AccountMemberService, AccountAdminService],
    exports: [AccountMemberService],
})
export class AccountModule {}
