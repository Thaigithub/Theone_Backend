import { Module } from '@nestjs/common';
import { ApplicationModule } from 'domain/application/application.module';
import { BannerModule } from 'domain/banner/banner.module';
import { CertificateModule } from 'domain/certificate/certificate.module';
import { CodeModule } from 'domain/code/code.module';
import { ContractModule } from 'domain/contract/contract.module';
import { EvaluationModule } from 'domain/evaluation/evaluation.module';
import { FileModule } from 'domain/file/file.module';
import { HeadhuntingModule } from 'domain/headhunting/headhunting.module';
import { InterviewModule } from 'domain/interview/interview.module';
import { MatchingModule } from 'domain/matching/matching.module';
import { MemberModule } from 'domain/member/member.module';
import { PostModule } from 'domain/post/post.module';
import { RecommendationModule } from 'domain/recommendation/recommendation.module';
import { SiteModule } from 'domain/site/site.module';
import { SpecialLicenseModule } from 'domain/special-license/special-license.module';
import { RegionModule } from 'region/region.module';
import { AccountModule } from './domain/account/account.module';
import { AdminModule } from './domain/admin/admin.module';
import { AuthModule } from './domain/auth/auth.module';
import { CareerModule } from './domain/career/career.module';
import { CompanyModule } from './domain/company/company.module';
import { TeamModule } from './domain/team/team.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { ManpowerModule } from 'domain/manpower/manpower.module';
import { FilterModule } from 'domain/filter/filter.module';
@Module({
    imports: [
        FilterModule,
        PrismaModule,
        AccountModule,
        AuthModule,
        CompanyModule,
        MemberModule,
        CertificateModule,
        SpecialLicenseModule,
        TeamModule,
        CareerModule,
        AdminModule,
        BannerModule,
        EvaluationModule,
        CodeModule,
        PostModule,
        FileModule,
        ApplicationModule,
        SiteModule,
        RecommendationModule,
        InterviewModule,
        HeadhuntingModule,
        ContractModule,
        ManpowerModule,
        MatchingModule,
        RegionModule,
    ],
})
export class AppModule {}
