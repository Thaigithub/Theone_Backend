import { Module } from '@nestjs/common';
import { CompanyAdminController } from 'domain/company/admin/company-admin.controller';
import { ExcelModule } from 'services/excel/excel.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CompanyAdminService } from './admin/company-admin.service';
@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [CompanyAdminController],
    providers: [CompanyAdminService],
})
export class CompanyModule {}
