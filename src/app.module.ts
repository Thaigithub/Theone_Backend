import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/ioc-containers/prisma.module';
import { AccountModule } from './infrastructure/ioc-containers/account.module';
import { AuthModule } from 'infrastructure/ioc-containers/auth.module';
import { FileModule } from 'infrastructure/ioc-containers/file.module';

@Module({
  imports: [PrismaModule, AccountModule, AuthModule, FileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
