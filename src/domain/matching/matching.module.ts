import { Module } from '@nestjs/common';
import { PostModule } from 'domain/post/post.module';
import { RecommendationModule } from 'domain/recommendation/recommendation.module';
import { TeamModule } from 'domain/team/team.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { MatchingCompanyController } from './company/matching-company.controller';
import { MatchingCompanyService } from './company/matching-company.service';
import { MatchingMemberController } from './member/matching-member.controller';
import { MatchingMemberService } from './member/matching-member.service';

@Module({
    imports: [PrismaModule, RecommendationModule, PostModule, TeamModule],
    controllers: [MatchingCompanyController, MatchingMemberController],
    providers: [MatchingCompanyService, MatchingMemberService],
})
export class MatchingModule {}
