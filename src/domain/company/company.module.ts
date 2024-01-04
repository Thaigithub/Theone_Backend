import { Module } from '@nestjs/common';
import { AdminCompanyController } from 'domain/company/admin/company-admin.controller';
import { ExcelModule } from 'services/excel/excel.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AdminCompanyService } from './admin/company-admin.service';
@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [AdminCompanyController],
    providers: [AdminCompanyService],
})
export class CompanyModule {}
