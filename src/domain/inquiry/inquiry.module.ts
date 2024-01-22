import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { InquiryCompanyController } from './company/inquiry-company.controller';
import { InquiryCompanyService } from './company/inquiry-company.service';
import { InquiryMemberController } from './member/inquiry-member.controller';
import { InquiryMemberService } from './member/inquiry-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [InquiryMemberController, InquiryCompanyController],
    providers: [InquiryMemberService, InquiryCompanyService],
})
export class InquiryModule {}
