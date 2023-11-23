import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/ioc-containers/prisma.module';
import { AccountModule } from './infrastructure/ioc-containers/account.module';
import { AuthModule } from 'infrastructure/ioc-containers/auth.module';

@Module({
  imports: [PrismaModule, AccountModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
