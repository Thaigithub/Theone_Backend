import { Module } from '@nestjs/common';
import { ApplicationModule } from 'domain/application/application.module';
import { MemberModule } from 'domain/member/member.module';
import { PrismaModule } from 'services/prisma/prisma.module';
import { InterviewCompanyController } from './company/interview-company.controller';
import { InterviewCompanyService } from './company/interview-company.service';
import { InterviewMemberController } from './member/interview-member.controller';
import { InterviewMemberService } from './member/interview-member.service';
import { NotificationModule } from 'domain/notification/notification.module';

@Module({
    imports: [PrismaModule, MemberModule, ApplicationModule, NotificationModule],
    controllers: [InterviewCompanyController, InterviewMemberController],
    providers: [InterviewCompanyService, InterviewMemberService],
})
export class InterviewModule {}
