import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { CompanyAuthService } from './auth-company.service';
import { AuthCompanyLoginRequest } from './request/auth-company-login-normal.request';
import { AuthCompanyPasswordRequest } from './request/auth-company-otp-send-password.request';
import { AuthCompanyUserIdRequest } from './request/auth-company-otp-send-username.request';
import { AuthCompanyOtpVerifyRequest } from './request/auth-company-otp-verify.request';
import { AuthCompanyLoginResponse } from './response/auth-company-login.response';
import { AuthCompanyOtpSendResponse } from './response/auth-company-otp-send.response';
import { AuthCompanyOtpVerifyResponse } from './response/auth-company-otp-verify.response';
@ApiTags('[COMPANY] Authenticate')
@Controller('/company/auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class CompanyAuthController {
    constructor(private companyAuthService: CompanyAuthService) {}
    // Normal
    @Post('/login')
    async login(@Body() authUserDto: AuthCompanyLoginRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        return BaseResponse.of(await this.companyAuthService.login(authUserDto));
    }

    @Post('/send-otp-username')
    async sendOTPToGetUserId(
        @Body() body: AuthCompanyUserIdRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthCompanyOtpSendResponse>> {
        return BaseResponse.of(await this.companyAuthService.sendOtp(body, req.ip));
    }

    @Post('/send-otp-password')
    async sendOTPToGetPassword(
        @Body() body: AuthCompanyPasswordRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthCompanyOtpSendResponse>> {
        return BaseResponse.of(await this.companyAuthService.sendOtp(body, req.ip));
    }

    @Post('/verify-otp')
    async verifyOTPToGetUserID(
        @Body() body: AuthCompanyOtpVerifyRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthCompanyOtpVerifyResponse>> {
        return BaseResponse.of(await this.companyAuthService.verifyOtp(body, req.ip));
    }
}
