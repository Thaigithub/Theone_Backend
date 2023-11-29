import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AccountModule } from './account.module';
import { AuthModule } from './auth.module';
import { CompanyModule } from './company.module';
import { MemberModule } from './member.module';
@Module({
  imports: [PrismaModule, AccountModule, AuthModule, CompanyModule, MemberModule],
})
export class AppModule {}
