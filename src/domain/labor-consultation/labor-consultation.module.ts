import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { LaborConsultationAdminController } from './admin/labor-consultation-admin.controller';
import { LaborConsultationAdminService } from './admin/labor-consultation-admin.service';
import { LaborConsultationCompanyController } from './company/labor-consultation-company.controller';
import { LaborConsultationCompanyService } from './company/labor-consultation-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [LaborConsultationCompanyController, LaborConsultationAdminController],
    providers: [LaborConsultationCompanyService, LaborConsultationAdminService],
})
export class LaborConsultationModule {}
