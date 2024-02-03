import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { InquiryAdminController } from './admin/inquiry-admin.controller';
import { InquiryAdminService } from './admin/inquiry-admin.service';
import { InquiryCompanyController } from './company/inquiry-company.controller';
import { InquiryCompanyService } from './company/inquiry-company.service';
import { InquiryMemberController } from './member/inquiry-member.controller';
import { InquiryMemberService } from './member/inquiry-member.service';
import { NotificationModule } from 'domain/notification/notification.module';
@Module({
    imports: [PrismaModule, NotificationModule],
    controllers: [InquiryMemberController, InquiryCompanyController, InquiryAdminController],
    providers: [InquiryMemberService, InquiryCompanyService, InquiryAdminService],
})
export class InquiryModule {}
