import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { InquiryMemberController } from './member/inquiry-member.controller';
import { InquiryMemberService } from './member/inquiry-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [InquiryMemberController],
    providers: [InquiryMemberService],
})
export class InquiryModule {}
