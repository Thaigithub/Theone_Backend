import { Module } from '@nestjs/common';
import { CertificateModule } from 'domain/certificate/certificate.module';
import { MemberModule } from 'domain/member/member.module';
import { AccountModule } from './domain/account/account.module';
import { AdminModule } from './domain/admin/admin.module';
import { AuthModule } from './domain/auth/auth.module';
import { CareerModule } from './domain/career/career.module';
import { CompanyModule } from './domain/company/company.module';
import { TeamModule } from './domain/team/team.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { EvaluationModule } from 'domain/evaluation/evaluation.module';
@Module({
    imports: [
        PrismaModule,
        AccountModule,
        AuthModule,
        CompanyModule,
        MemberModule,
        CertificateModule,
        TeamModule,
        CareerModule,
        AdminModule,
        EvaluationModule,
    ],
})
export class AppModule {}
