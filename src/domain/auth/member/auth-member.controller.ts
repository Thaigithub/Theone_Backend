import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { DeviceMemberService } from 'domain/device/member/device-member.service';
import { Request } from 'express';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { DeviceTokenRequest } from 'utils/generics/device-token.request';
import { AuthJwtGuard } from '../auth-jwt.guard';
import { AuthRoleGuard, Roles } from '../auth-role.guard';
import { MemberAuthService } from './auth-member.service';
import { AuthMemberLoginRequest } from './request/auth-member-login-normal.request';
import { AuthMemberLoginSocialRequest } from './request/auth-member-login-social.request';
import { AuthMemberPasswordRequest } from './request/auth-member-otp-send-password.request';
import { AuthMemberUserIdRequest } from './request/auth-member-otp-send-username.request';
import { AuthMemberOtpVerifyRequest } from './request/auth-member-otp-verify.request';
import { AuthMemberUpdatePasswordRequest } from './request/auth-member-update-password.request';
import { AuthMemberLoginResponse } from './response/auth-member-login.response';
import { AuthMemberOtpSendResponse } from './response/auth-member-otp-send.response';
import { AuthMemberOtpVerifyResponse } from './response/auth-member-otp-verify.response';

@Controller('/member/auth')
export class MemberAuthController {
    constructor(
        private memberAuthService: MemberAuthService,
        private deviceMemberService: DeviceMemberService,
    ) {}

    @Post('/login/google')
    async googlelogin(@Body() authUserDto: AuthMemberLoginSocialRequest): Promise<BaseResponse<AuthMemberLoginResponse>> {
        return BaseResponse.of(await this.memberAuthService.googleLogin(authUserDto));
    }

    @Post('/login/apple')
    async applelogin(@Body() authUserDto: AuthMemberLoginSocialRequest): Promise<BaseResponse<AuthMemberLoginResponse>> {
        return BaseResponse.of(await this.memberAuthService.appleLogin(authUserDto));
    }

    @Post('/login/kakao')
    async kakaologin(@Body() authUserDto: AuthMemberLoginSocialRequest): Promise<BaseResponse<AuthMemberLoginResponse>> {
        return BaseResponse.of(await this.memberAuthService.kakaoLogin(authUserDto));
    }

    @Post('/login/naver')
    async naverlogin(@Body() authUserDto: AuthMemberLoginSocialRequest): Promise<BaseResponse<AuthMemberLoginResponse>> {
        return BaseResponse.of(await this.memberAuthService.kakaoLogin(authUserDto));
    }

    @Post('/login')
    async login(@Body() authUserDto: AuthMemberLoginRequest): Promise<BaseResponse<AuthMemberLoginResponse>> {
        return BaseResponse.of(await this.memberAuthService.login(authUserDto));
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Post('/logout')
    async logout(@Req() req: BaseRequest, @Body() body: DeviceTokenRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.deviceMemberService.delete(req.user.accountId, body));
    }

    @Post('/otp/username')
    async sendOTPToGetUsername(
        @Body() body: AuthMemberUserIdRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthMemberOtpSendResponse>> {
        return BaseResponse.of(await this.memberAuthService.sendOtp(body, req.ip));
    }

    @Post('/otp/password')
    async sendOTPToGetPassword(
        @Body() body: AuthMemberPasswordRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthMemberOtpSendResponse>> {
        return BaseResponse.of(await this.memberAuthService.sendOtp(body, req.ip));
    }

    @Post('/otp/verification')
    async verifyOTPToGetUsername(
        @Body() body: AuthMemberOtpVerifyRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthMemberOtpVerifyResponse>> {
        return BaseResponse.of(await this.memberAuthService.verifyOtp(body, req.ip));
    }

    @Patch('/password')
    async updatePassword(@Req() req: Request, @Body() body: AuthMemberUpdatePasswordRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memberAuthService.updatePassword(body, req.ip));
    }
}
