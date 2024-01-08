import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { MemberAuthService } from './auth-member.service';
import { AuthMemberLoginRequest } from './request/auth-member-login-normal.request';
import { AuthMemberLoginSocialRequest } from './request/auth-member-login-social.request';
import { AuthMemberPasswordRequest } from './request/auth-member-otp-send-password.request';
import { AuthMemberUserIdRequest } from './request/auth-member-otp-send-username.request';
import { AuthMemberOtpVerifyRequest } from './request/auth-member-otp-verify.request';
import { AuthMemberLoginResponse } from './response/auth-member-login.response';
import { AuthMemberOtpSendResponse } from './response/auth-member-otp-send.response';
import { AuthMemberOtpVerifyResponse } from './response/auth-member-otp-verify.response';

@Controller('/member/auth')
export class MemberAuthController {
    constructor(private memberAuthService: MemberAuthService) {}

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

    @Post('/send-otp-username')
    async sendOTPToGetUserId(
        @Body() body: AuthMemberUserIdRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthMemberOtpSendResponse>> {
        return BaseResponse.of(await this.memberAuthService.sendOtp(body, req.ip));
    }

    @Post('/send-otp-password')
    async sendOTPToGetPassword(
        @Body() body: AuthMemberPasswordRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthMemberOtpSendResponse>> {
        return BaseResponse.of(await this.memberAuthService.sendOtp(body, req.ip));
    }

    @Post('/verify-otp')
    async verifyOTPToGetUserID(
        @Body() body: AuthMemberOtpVerifyRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthMemberOtpVerifyResponse>> {
        return BaseResponse.of(await this.memberAuthService.verifyOtp(body, req.ip));
    }
}
