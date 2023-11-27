import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRE_HOURS } from 'app.config';
import { PrismaModule } from './prisma.module';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { AuthController } from 'presentation/controllers/auth.controller';
import { AccountModule } from './account.module';
import { JwtStrategy } from 'infrastructure/passport/strategies/jwt.strategy';
import { AuthUseCaseImpl } from 'infrastructure/use-cases/auth.use-case.impl';
import { OtpProviderModule } from './otp-provider.module';
import { OtpProviderRepositoryImpl } from 'infrastructure/repositories/otp-provider.repository.impl';
import { OtpProviderRepository } from 'domain/repositories/otp-provider.repository';
import { OtpModule } from './sms.module';
import { OtpService } from 'infrastructure/services/sms.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { algorithm: 'HS384',expiresIn: JWT_ACCESS_TOKEN_EXPIRE_HOURS },
      verifyOptions: { algorithms: ['HS384'] },

    }),
    PrismaModule,
    AccountModule,
    OtpProviderModule,
    OtpModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthUseCase,
      useClass: AuthUseCaseImpl,
    },
    {
      provide: OtpProviderRepository,
      useClass: OtpProviderRepositoryImpl,
    },
    JwtStrategy,
    OtpService,
  ],
  exports: [AuthUseCase],
})
export class AuthModule {}
