import { Module } from '@nestjs/common';
import { ExcelModule } from 'services/excel/excel.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { MemberAdminController } from './admin/member-admin.controller';
import { MemberAdminService } from './admin/member-admin.service';
import { MemberCompanyController } from './company/member-company.controller';
import { MemberCompanyService } from './company/member-company.service';

@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [MemberAdminController, MemberCompanyController],
    providers: [MemberAdminService, MemberCompanyService],
    exports: [MemberCompanyService],
})
export class MemberModule {}
