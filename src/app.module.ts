import { Module } from '@nestjs/common';
import { AnnouncementModule } from 'domain/announcement/announcement.module';
import { ApplicationModule } from 'domain/application/application.module';
import { BankModule } from 'domain/bank/bank.module';
import { BannerModule } from 'domain/banner/banner.module';
import { CodeModule } from 'domain/code/code.module';
import { ContractModule } from 'domain/contract/contract.module';
import { CurrencyExchangeModule } from 'domain/currency-exchange/currency-exchange.module';
import { EvaluationModule } from 'domain/evaluation/evaluation.module';
import { FaqModule } from 'domain/faq/faq.module';
import { FileModule } from 'domain/file/file.module';
import { HeadhuntingModule } from 'domain/headhunting/headhunting.module';
import { InquiryModule } from 'domain/inquiry/inquiry.module';
import { InterestModule } from 'domain/interest/interest.module';
import { InterviewModule } from 'domain/interview/interview.module';
import { LaborConsultationModule } from 'domain/labor-consultation/labor-consultation.module';
import { LaborModule } from 'domain/labor/labor.module';
import { LicenseModule } from 'domain/license/license.module';
import { MatchingModule } from 'domain/matching/matching.module';
import { MemberModule } from 'domain/member/member.module';
import { MemoModule } from 'domain/memo/memo.module';
import { PointModule } from 'domain/point/point.module';
import { PostModule } from 'domain/post/post.module';
import { PreferenceModule } from 'domain/preference/preference.module';
import { ProductModule } from 'domain/product/product.module';
import { RegionModule } from 'domain/region/region.module';
import { ReportModule } from 'domain/report/report.module';
import { SalaryReportModule } from 'domain/salary-report/salary-report.module';
import { SettlementModule } from 'domain/settlement/settlement.module';
import { SiteModule } from 'domain/site/site.module';
import { TermModule } from 'domain/term/term.module';
import { CronJobModule } from 'services/cronjob/cronjob.module';
import { FireBaseModule } from 'services/firebase/firebase.module';
import { AccountModule } from './domain/account/account.module';
import { AdminModule } from './domain/admin/admin.module';
import { AuthModule } from './domain/auth/auth.module';
import { CareerModule } from './domain/career/career.module';
import { CompanyModule } from './domain/company/company.module';
import { NotificationModule } from './domain/notification/notification.module';
import { TeamModule } from './domain/team/team.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { DeviceModule } from 'domain/device/device.module';

@Module({
    imports: [
        BankModule,
        PrismaModule,
        AccountModule,
        AuthModule,
        CompanyModule,
        MemberModule,
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
        HeadhuntingModule,
        ContractModule,
        MatchingModule,
        RegionModule,
        LaborModule,
        PointModule,
        ProductModule,
        CurrencyExchangeModule,
        NotificationModule,
        InterestModule,
        PreferenceModule,
        AnnouncementModule,
        SalaryReportModule,
        InquiryModule,
        TermModule,
        FaqModule,
        ReportModule,
        MemoModule,
        CronJobModule,
        LaborConsultationModule,
        LicenseModule,
        SettlementModule,
        FireBaseModule,
        DeviceModule,
    ],
})
export class AppModule {}
