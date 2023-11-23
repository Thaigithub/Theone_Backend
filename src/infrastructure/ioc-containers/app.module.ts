import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { AccountModule } from './account.module';

@Module({
  imports: [PrismaModule, AccountModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
