import { Module } from '@nestjs/common';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { AuthController } from 'presentation/controllers/auth.controller';
import { AuthUseCaseImpl } from '../use-cases/auth.use-case.impl';
import { PrismaModule } from './prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET_KEY } from 'app.config';
import { AccountModule } from './account.module';
import { CompanyModule } from './company.module';
import { JwtStrategy } from 'infrastructure/passport/strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { algorithm: 'HS384' },
      verifyOptions: { algorithms: ['HS384'] },
    }),
    PrismaModule,
    AccountModule,
    CompanyModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthUseCase,
      useClass: AuthUseCaseImpl,
    },
    JwtStrategy,
  ],
  exports: [AuthUseCase],
})
export class AuthModule {}
