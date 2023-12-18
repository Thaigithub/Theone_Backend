import { Module } from '@nestjs/common';
import { MemberModule } from 'domain/member/member.module';
import { TeamModule } from 'domain/team/team.module';
import { PrismaModule } from 'services/prisma/prisma.module';
import { InterviewCompanyController } from './company/interview-company.controller';
import { InterviewCompanyService } from './company/interview-company.service';

@Module({
    imports: [PrismaModule, MemberModule, TeamModule],
    controllers: [InterviewCompanyController],
    providers: [InterviewCompanyService],
})
export class InterviewModule {}
