import { Module } from '@nestjs/common';
import { AccountModule } from './domain/account/account.module';
import { AuthModule } from './domain/auth/auth.module';
import { CareerModule } from './domain/career/career.module';
import { CertificateModule } from './domain/certification/certificate.module';
import { CompanyModule } from './domain/company/company.module';
import { MemberModule } from './domain/member/member.module';
import { TeamModule } from './domain/team/team.module';
import { PrismaModule } from './helpers/entity/prisma.module';
@Module({
    imports: [PrismaModule, AccountModule, AuthModule, CompanyModule, MemberModule, CertificateModule, TeamModule, CareerModule],
})
export class AppModule {}
