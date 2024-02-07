import { Module } from '@nestjs/common';
import { MemberModule } from 'domain/member/member.module';
import { PostModule } from 'domain/post/post.module';
import { TeamModule } from 'domain/team/team.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { MatchingAdminController } from './admin/matching-admin.controller';
import { MatchingAdminService } from './admin/matching-admin.service';
import { MatchingCompanyController } from './company/matching-company.controller';
import { MatchingCompanyService } from './company/matching-company.service';

@Module({
    imports: [PrismaModule, PostModule, TeamModule, MemberModule],
    controllers: [MatchingCompanyController, MatchingAdminController],
    providers: [MatchingCompanyService, MatchingAdminService],
})
export class MatchingModule {}
