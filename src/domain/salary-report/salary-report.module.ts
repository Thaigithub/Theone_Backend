import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { SalaryReportAdminController } from './admin/salary-report-admin.controller';
import { SalaryReportAdminService } from './admin/salary-report-admin.service';
import { SalaryReportCompanyController } from './company/salary-report-company.controller';
import { SalaryReportCompanyService } from './company/salary-report-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [SalaryReportAdminController, SalaryReportCompanyController],
    providers: [SalaryReportAdminService, SalaryReportCompanyService],
    exports: [],
})
export class SalaryReportModule {}
