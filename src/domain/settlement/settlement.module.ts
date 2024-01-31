import { Module } from '@nestjs/common';
import { ExcelModule } from 'services/excel/excel.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { SettlementAdminController } from './admin/settlement-admin.controller';
import { SettlementAdminService } from './admin/settlement-admin.service';
import { SettlementCompanyController } from './company/settlement-company.controller';
import { SettlementCompanyService } from './company/settlement-company.service';

@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [SettlementAdminController, SettlementCompanyController],
    providers: [SettlementAdminService, SettlementCompanyService],
})
export class SettlementModule {}
