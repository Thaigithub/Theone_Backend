import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_ACCESS_TOKEN_EXPIRE_HOURS, JWT_SECRET_KEY } from 'app.config';
import { AuthJwtStrategy } from 'domain/auth/auth-jwt.strategy';
import { OtpModule } from 'domain/otp/otp.module';
import { PrismaModule } from 'services/prisma/prisma.module';
import { AdminAuthController } from './admin/auth-admin.controller';
import { AdminAuthService } from './admin/auth-admin.service';
import { CompanyAuthController } from './company/auth-company.controller';
import { CompanyAuthService } from './company/auth-company.service';
import { MemberAuthController } from './member/auth-member.controller';
import { MemberAuthService } from './member/auth-member.service';
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
        OtpModule,
    ],
    controllers: [AdminAuthController, CompanyAuthController, MemberAuthController],
    providers: [AuthJwtStrategy, AdminAuthService, CompanyAuthService, MemberAuthService],
})
export class AuthModule {}
