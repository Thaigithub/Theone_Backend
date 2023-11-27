import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AccountModule } from './account.module';
import { AuthModule } from './auth.module';
import { AdminMemberModule } from './admin-member.module';
import { AdminCompanyModule } from './admin-company.module';
@Module({
  imports: [
    PrismaModule,
    AccountModule,
    AuthModule,
    AdminMemberModule,
    AdminCompanyModule,
  ],
})
export class AppModule {}
