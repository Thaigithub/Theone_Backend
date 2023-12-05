import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AccountAdminController } from './admin/account-admin.controller';
import { AccountAdminService } from './admin/account-admin.service';
import { AccountCompanyController } from './company/account-company.controller';
import { AccountCompanyService } from './company/account-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [AccountAdminController, AccountCompanyController],
    providers: [AccountAdminService, AccountCompanyService],
})
export class AccountModule {}
