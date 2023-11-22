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
import { UserModule } from './user.module';
import { JwtStrategy } from '../passport/strategies/jwt.strategy';
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
    UserModule,
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
