import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AccountModule } from './account.module';
import { AuthModule } from './auth.module';
import { CompanyModule } from './company.module';
@Module({
  imports: [PrismaModule, AccountModule, AuthModule, CompanyModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
