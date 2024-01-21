import { Module } from '@nestjs/common';
import { PostModule } from 'domain/post/post.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { MatchingAdminController } from './admin/matching-admin.controller';
import { MatchingAdminService } from './admin/matching-admin.service';
import { MatchingCompanyController } from './company/matching-company.controller';
import { MatchingCompanyService } from './company/matching-company.service';
import { MatchingMemberController } from './member/matching-member.controller';
import { MatchingMemberService } from './member/matching-member.service';

@Module({
    imports: [PrismaModule, PostModule],
    controllers: [MatchingCompanyController, MatchingMemberController, MatchingAdminController],
    providers: [MatchingCompanyService, MatchingMemberService, MatchingAdminService],
})
export class MatchingModule {}
