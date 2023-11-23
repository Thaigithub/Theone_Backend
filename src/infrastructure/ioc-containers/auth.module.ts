import { Module } from '@nestjs/common';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';
import { AuthUseCaseImpl } from '../use-cases/auth.use-case.impl';
import { PrismaModule } from './prisma.module';
import { GoogleStrategy } from '../passport/strategies/google.strategy';
import { KakaoStrategy } from '../passport/strategies/kakao.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET_KEY } from 'app.config';
import { PrismaModule } from './prisma.module';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { AuthController } from 'presentation/controllers/auth.controller';
import { AccountModule } from './account.module';
import { JwtStrategy } from 'infrastructure/passport/strategies/jwt.strategy';
import { AuthUseCaseImpl } from 'infrastructure/use-cases/auth.use-case.impl';

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
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthUseCase,
      useClass: AuthUseCaseImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    GoogleStrategy,
    KakaoStrategy,
    JwtStrategy,
  ],
  exports: [AuthUseCase],
})
export class AuthModule {}
