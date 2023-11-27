import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/ioc-containers/prisma.module';
import { AccountModule } from './infrastructure/ioc-containers/account.module';
import { AuthModule } from 'infrastructure/ioc-containers/auth.module';
import { AdminMemberModule } from 'infrastructure/ioc-containers/admin-member.module';
import { TeamModule } from 'infrastructure/ioc-containers/team.module';

@Module({
  imports: [PrismaModule, AccountModule, AuthModule, AdminMemberModule, TeamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
