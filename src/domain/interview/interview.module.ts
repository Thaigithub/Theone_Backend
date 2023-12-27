import { Module } from '@nestjs/common';
import { MemberModule } from 'domain/member/member.module';
import { TeamModule } from 'domain/team/team.module';
import { PrismaModule } from 'services/prisma/prisma.module';
import { InterviewCompanyController } from './company/interview-company.controller';
import { InterviewCompanyService } from './company/interview-company.service';
import { InterviewMemberController } from './member/interview-member.controller';
import { InterviewMemberService } from './member/interview-member.service';

@Module({
    imports: [PrismaModule, MemberModule, TeamModule],
    controllers: [InterviewCompanyController, InterviewMemberController],
    providers: [InterviewCompanyService, InterviewMemberService],
})
export class InterviewModule {}
