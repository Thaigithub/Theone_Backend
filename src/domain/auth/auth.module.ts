import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_ACCESS_TOKEN_EXPIRE_HOURS, JWT_SECRET_KEY } from 'app.config';
import { AuthJwtStrategy } from 'domain/auth/auth-jwt.strategy';
import { OtpModule } from 'domain/otp/otp.module';
import { OtpService } from 'domain/otp/otp.service';
import { PrismaModule } from 'services/prisma/prisma.module';
import { AuthAdminController } from './admin/auth-admin.controller';
import { AuthAdminService } from './admin/auth-admin.service';
import { AuthCompanyController } from './company/auth-company.controller';
import { AuthCompanyService } from './company/auth-company.service';
import { AuthMemberController } from './member/auth-member.controller';
import { AuthMemberService } from './member/auth-member.service';
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
    controllers: [AuthAdminController, AuthCompanyController, AuthMemberController],
    providers: [AuthJwtStrategy, AuthAdminService, AuthCompanyService, AuthMemberService, OtpService],
})
export class AuthModule {}
