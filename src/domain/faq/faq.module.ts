import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { FaqAdminController } from './admin/faq-admin.controller';
import { FaqAdminService } from './admin/faq-admin.service';
import { FaqCompanyController } from './company/faq-company.controller';
import { FaqCompanyService } from './company/faq-company.service';
import { FaqGuestController } from './guest/faq-guest.controller';
import { FaqGuestService } from './guest/faq-guest.service';

@Module({
    imports: [PrismaModule],
    controllers: [FaqAdminController, FaqCompanyController, FaqGuestController],
    providers: [FaqAdminService, FaqCompanyService, FaqGuestService],
})
export class FaqModule {}
