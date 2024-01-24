import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { LaborConsultationCompanyController } from './company/labor-consultation-company.controller';
import { LaborConsultationCompanyService } from './company/labor-consultation-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [LaborConsultationCompanyController],
    providers: [LaborConsultationCompanyService],
})
export class LaborConsultationModule {}
