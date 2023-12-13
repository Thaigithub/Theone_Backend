import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { CompanyAuthService } from './auth-company.service';
import { AuthCompanyPasswordRequest } from './request/auth-company-email-password.request';
import { AuthCompanyUserIdRequest } from './request/auth-company-email-username.request';
import { AuthCompanyLoginRequest } from './request/auth-company-login-normal.request';
import { AuthCompanyPasswordEmailCheckValidRequest } from './request/auth-company-verify-email-password.request';
import { AuthCompanyUserIdEmailCheckValidRequest } from './request/auth-company-verify-email-username.request';
import { AuthCompanyLoginResponse } from './response/auth-company-login.response';
@ApiTags('[COMPANY] Authenticate')
@Controller('/company/auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class CompanyAuthController {
    constructor(private readonly companyAuthService: CompanyAuthService) {}
    // Normal
    @Post('/login')
    @ApiOperation({
        summary: 'Login',
        description: 'This endpoint to login normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully', type: AuthCompanyLoginResponse })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials', type: BaseResponse })
    async login(@Body() authUserDto: AuthCompanyLoginRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        // console.log(await hash(authUserDto.password, 10));
        return BaseResponse.of(await this.companyAuthService.login(authUserDto));
    }

    @Post('/email/send-otp-request-to-get-userID')
    @ApiOperation({
        summary: 'Send Email verification to get UserName',
        description: 'This endpoint send email to verify the user account to get current UserID.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Send OTP verification successfully', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Name or phone number not found', type: BaseResponse })
    async sendOTPToGetUserId(@Body() body: AuthCompanyUserIdRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.companyAuthService.sendEmailOtp(body, false));
    }

    @Post('/email/send-otp-request-to-get-password')
    @ApiOperation({
        summary: 'Send Email verification to get Password',
        description: 'This endpoint send email to verify the user account to get current password.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Send OTP verification successfully', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Name or phone number or userName not found', type: BaseResponse })
    async sendOTPToGetPassword(@Body() body: AuthCompanyPasswordRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.companyAuthService.sendEmailOtp(body, true));
    }

    @Post('/email/verify-otp-to-get-userId')
    @ApiOperation({
        summary: 'Verify OTP code',
        description: 'This endpoint will verify the given OTP code from user to get userName.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Verify OTP successfully', type: Boolean })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Verify OTP failed', type: BaseResponse })
    async verifyOTPToGetUserID(@Body() body: AuthCompanyUserIdEmailCheckValidRequest): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.companyAuthService.verifyEmailOtp(body, false));
    }

    @Post('/email/verify-otp-to-get-password')
    @ApiOperation({
        summary: 'Verify OTP code',
        description: 'This endpoint will verify the given OTP code from user to get password.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Verify OTP successfully', type: Boolean })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Verify OTP failed', type: BaseResponse })
    async verifyOTPToGetPassword(@Body() body: AuthCompanyPasswordEmailCheckValidRequest): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.companyAuthService.verifyEmailOtp(body, true));
    }
}
