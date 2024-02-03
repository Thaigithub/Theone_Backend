import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { LaborConsultationAdminController } from './admin/labor-consultation-admin.controller';
import { LaborConsultationAdminService } from './admin/labor-consultation-admin.service';
import { LaborConsultationCompanyController } from './company/labor-consultation-company.controller';
import { LaborConsultationCompanyService } from './company/labor-consultation-company.service';
import { LaborConsultationMemberController } from './member/labor-consultation-member.controller';
import { LaborConsultationMemberService } from './member/labor-consultation-member.service';
import { NotificationModule } from 'domain/notification/notification.module';

@Module({
    imports: [PrismaModule, NotificationModule],
    controllers: [LaborConsultationCompanyController, LaborConsultationAdminController, LaborConsultationMemberController],
    providers: [LaborConsultationCompanyService, LaborConsultationAdminService, LaborConsultationMemberService],
})
export class LaborConsultationModule {}
