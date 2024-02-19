import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { DeviceMemberService } from 'domain/device/member/device-member.service';
import { Request } from 'express';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { DeviceTokenRequest } from 'utils/generics/device-token.request';
import { AuthJwtGuard } from '../auth-jwt.guard';
import { AuthRoleGuard, Roles } from '../auth-role.guard';
import { CompanyAuthService } from './auth-company.service';
import { AuthCompanyLoginRequest } from './request/auth-company-login-normal.request';
import { AuthCompanyPasswordRequest } from './request/auth-company-otp-send-password.request';
import { AuthCompanyUserIdRequest } from './request/auth-company-otp-send-username.request';
import { AuthCompanyOtpVerifyRequest } from './request/auth-company-otp-verify.request';
import { AuthCompanyUpdatePasswordRequest } from './request/auth-company-update-password.request';
import { AuthCompanyLoginResponse } from './response/auth-company-login.response';
import { AuthCompanyOtpSendResponse } from './response/auth-company-otp-send.response';
import { AuthCompanyOtpVerifyResponse } from './response/auth-company-otp-verify.response';

@Controller('/company/auth')
export class CompanyAuthController {
    constructor(
        private companyAuthService: CompanyAuthService,
        private deviceMemberService: DeviceMemberService,
    ) {}

    @Post('/login')
    async login(@Body() authUserDto: AuthCompanyLoginRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        return BaseResponse.of(await this.companyAuthService.login(authUserDto));
    }

    @Roles(AccountType.COMPANY)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Post('/logout')
    async logout(@Req() req: BaseRequest, @Body() body: DeviceTokenRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.deviceMemberService.delete(req.user.accountId, body));
    }

    @Post('/otp/username')
    async sendOTPToGetUsername(
        @Body() body: AuthCompanyUserIdRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthCompanyOtpSendResponse>> {
        return BaseResponse.of(await this.companyAuthService.sendOtp(body, req.ip));
    }

    @Post('/otp/password')
    async sendOTPToGetPassword(
        @Body() body: AuthCompanyPasswordRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthCompanyOtpSendResponse>> {
        return BaseResponse.of(await this.companyAuthService.sendOtp(body, req.ip));
    }

    @Post('/otp/verification')
    async verifyOTP(
        @Body() body: AuthCompanyOtpVerifyRequest,
        @Req() req: Request,
    ): Promise<BaseResponse<AuthCompanyOtpVerifyResponse>> {
        return BaseResponse.of(await this.companyAuthService.verifyOtp(body, req.ip));
    }

    @Patch('/password')
    async updatePassword(@Req() req: Request, @Body() body: AuthCompanyUpdatePasswordRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.companyAuthService.updatePassword(body, req.ip));
    }
}
