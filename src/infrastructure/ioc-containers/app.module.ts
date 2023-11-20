import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    })
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
