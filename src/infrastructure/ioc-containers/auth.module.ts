import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET_KEY } from 'app.config';
import { PrismaModule } from './prisma.module';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { AuthController } from 'presentation/controllers/auth.controller';
import { UserModule } from './user.module';
import { JwtStrategy } from 'application/passport/strategies/jwt.strategy';
import { AuthUseCaseImpl } from 'infrastructure/use-cases/auth.use-case.impl';

@Module({
  imports: [
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
    JwtStrategy,
  ],
  exports: [AuthUseCase],
})
export class AuthModule {}
