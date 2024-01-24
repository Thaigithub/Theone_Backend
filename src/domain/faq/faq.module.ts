import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { FaqAdminController } from './admin/faq-admin.controller';
import { FaqAdminService } from './admin/faq-admin.service';
import { FaqCompanyController } from './company/faq-company.controller';
import { FaqCompanyService } from './company/faq-company.service';
import { FaqMemberController } from './member/faq-member.controller';
import { FaqMemberService } from './member/faq-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [FaqAdminController, FaqCompanyController, FaqMemberController],
    providers: [FaqAdminService, FaqCompanyService, FaqMemberService],
})
export class FaqModule {}
