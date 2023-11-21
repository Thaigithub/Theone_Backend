import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
