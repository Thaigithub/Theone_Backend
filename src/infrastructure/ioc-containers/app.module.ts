import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AccountModule } from './account.module';
import { AuthModule } from './auth.module';
import { AdminModule } from './admin.module';
@Module({
  imports: [PrismaModule, AccountModule, AuthModule, AdminModule],
})
export class AppModule {}
