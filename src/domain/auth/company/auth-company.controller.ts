import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { CompanyAuthService } from './auth-company.service';
import { AuthCompanyPasswordRequest } from './request/auth-company-email-password.request';
import { AuthCompanyUserIdRequest } from './request/auth-company-email-username.request';
import { AuthCompanyLoginRequest } from './request/auth-company-login-normal.request';
import { AuthCompanyLoginSocialRequest } from './request/auth-company-login-social.request';
import { AuthCompanyPasswordEmailCheckValidRequest } from './request/auth-company-verify-email-password.request';
import { AuthCompanyUserIdEmailCheckValidRequest } from './request/auth-company-verify-email-username.request';
import { AuthCompanyLoginResponse } from './response/auth-company-login.response';
@ApiTags('[COMPANY] Authenticate')
@Controller('/company/auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class CompanyAuthController {
    constructor(private readonly companyAuthService: CompanyAuthService) {}

    // GOOGLE
    @Post('login/google')
    @ApiOperation({
        summary: 'Google Account Login',
        description: 'This endpoint login with Google acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Google Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async googlelogin(@Body() authUserDto: AuthCompanyLoginSocialRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        return BaseResponse.of(await this.companyAuthService.googleLogin(authUserDto));
    }
    // APPLE
    @Post('login/apple')
    @ApiOperation({
        summary: 'Apple Account Login',
        description: 'This endpoint login with Apple acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Apple Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async applelogin(@Body() authUserDto: AuthCompanyLoginSocialRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        return BaseResponse.of(await this.companyAuthService.appleLogin(authUserDto));
    }
    // KAKAO
    @Post('login/kakao')
    @ApiOperation({
        summary: 'Kakao Account Login',
        description: 'This endpoint login with Kakao acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Kakao Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async kakaologin(@Body() authUserDto: AuthCompanyLoginSocialRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        return BaseResponse.of(await this.companyAuthService.kakaoLogin(authUserDto));
    }
    // NAVER
    @Post('login/naver')
    @ApiOperation({
        summary: 'Naver Account Login',
        description: 'This endpoint login with Naver acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Naver Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async naverlogin(@Body() authUserDto: AuthCompanyLoginSocialRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        return BaseResponse.of(await this.companyAuthService.kakaoLogin(authUserDto));
    }
    // Normal
    @Post('login')
    @ApiOperation({
        summary: 'Login',
        description: 'This endpoint to login normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async login(@Body() authUserDto: AuthCompanyLoginRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        // console.log(await hash(authUserDto.password, 10));
        return BaseResponse.of(await this.companyAuthService.login(authUserDto));
    }

    @Post('email/send-otp-request-to-get-userID')
    @ApiOperation({
        summary: 'Send Email verification to get UserName',
        description: 'This endpoint send email to verify the user account to get current UserID.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Send OTP verification successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Name or phone number not found' })
    async sendOTPToGetUserId(@Body() body: AuthCompanyUserIdRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.companyAuthService.sendEmailOtp(body, false));
    }

    @Post('email/send-otp-request-to-get-password')
    @ApiOperation({
        summary: 'Send Email verification to get Password',
        description: 'This endpoint send email to verify the user account to get current password.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Send OTP verification successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Name or phone number or userName not found' })
    async sendOTPToGetPassword(@Body() body: AuthCompanyPasswordRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.companyAuthService.sendEmailOtp(body, true));
    }

    @Post('email/verify-otp-to-get-userId')
    @ApiOperation({
        summary: 'Verify OTP code',
        description: 'This endpoint will verify the given OTP code from user to get userName.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Verify OTP successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Verify OTP failed' })
    async verifyOTPToGetUserID(@Body() body: AuthCompanyUserIdEmailCheckValidRequest): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.companyAuthService.verifyEmailOtp(body, false));
    }

    @Post('email/verify-otp-to-get-password')
    @ApiOperation({
        summary: 'Verify OTP code',
        description: 'This endpoint will verify the given OTP code from user to get password.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Verify OTP successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Verify OTP failed' })
    async verifyOTPToGetPassword(@Body() body: AuthCompanyPasswordEmailCheckValidRequest): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.companyAuthService.verifyEmailOtp(body, true));
    }
}
