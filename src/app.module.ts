import { Module } from '@nestjs/common';
import { ApplicationModule } from 'domain/application/application.module';
import { BannerModule } from 'domain/banner/banner.module';
import { CertificateModule } from 'domain/certificate/certificate.module';
import { CodeModule } from 'domain/code/code.module';
import { EvaluationModule } from 'domain/evaluation/evaluation.module';
import { FileModule } from 'domain/file/file.module';
import { InterviewModule } from 'domain/interview/interview.module';
import { MemberModule } from 'domain/member/member.module';
import { PostModule } from 'domain/post/post.module';
import { SiteModule } from 'domain/site/site.module';
import { SpecialLicenseModule } from 'domain/special-license/special-license.module';
import { AccountModule } from './domain/account/account.module';
import { AdminModule } from './domain/admin/admin.module';
import { AuthModule } from './domain/auth/auth.module';
import { CareerModule } from './domain/career/career.module';
import { CompanyModule } from './domain/company/company.module';
import { TeamModule } from './domain/team/team.module';
import { PrismaModule } from './services/prisma/prisma.module';
@Module({
    imports: [
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
        InterviewModule,
    ],
})
export class AppModule {}
