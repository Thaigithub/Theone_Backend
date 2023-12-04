import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_ACCESS_TOKEN_EXPIRE_HOURS, JWT_SECRET_KEY } from 'app.config';
import { AuthJwtStrategy } from 'domain/auth/auth-jwt.strategy';
import { AuthController } from 'domain/auth/auth.controller';
import { AuthUseCase } from 'domain/auth/auth.usecase';
import { OtpProviderRepository } from 'domain/opt-provider/otp-provider.repository';
import { OtpProviderRepositoryImpl } from 'domain/opt-provider/otp-provider.repository.impl';
import { OtpService } from 'services/sms/sms.service';
import { PrismaModule } from '../../helpers/entity/prisma.module';
import { OtpModule } from '../../services/sms/sms.module';
import { AccountModule } from '../account/account.module';
import { CompanyModule } from '../company/company.module';
import { OtpProviderModule } from '../opt-provider/otp-provider.module';
import { AuthUseCaseImpl } from './auth.usecase.impl';
@Module({
    imports: [
        PrismaModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: JWT_SECRET_KEY,
            signOptions: { algorithm: 'HS384', expiresIn: JWT_ACCESS_TOKEN_EXPIRE_HOURS },
            verifyOptions: { algorithms: ['HS384'] },
        }),
        PrismaModule,
        AccountModule,
        OtpProviderModule,
        OtpModule,
        CompanyModule,
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
        AuthJwtStrategy,
        OtpService,
    ],
    exports: [AuthUseCase],
})
export class AuthModule {}
