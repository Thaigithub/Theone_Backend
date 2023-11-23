import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/ioc-containers/prisma.module';
import { UserModule } from './infrastructure/ioc-containers/user.module';
import { AuthModule } from 'infrastructure/ioc-containers/auth.module';
import { AdminMemberModule } from 'infrastructure/ioc-containers/admin-member.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, AdminMemberModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
