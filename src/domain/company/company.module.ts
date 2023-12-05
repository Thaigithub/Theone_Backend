import { Module } from '@nestjs/common';
import { AdminCompanyController } from 'domain/company/admin/company-admin.controller';
import { ExcelModule } from 'services/excel/excel.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AdminCompanyService } from './admin/company-admin.service';
import { CompanyCompanyController } from './company/company-company.controller';
import { CompanyCompanyService } from './company/company-company.service';
import { MemberCompanyService } from './member/company-member.service';
@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [AdminCompanyController, CompanyCompanyController],
    providers: [AdminCompanyService, CompanyCompanyService, MemberCompanyService],
})
export class CompanyModule {}
