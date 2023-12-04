import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { AuthUseCase } from 'domain/auth/auth.use-case';
import { OtpVerificationRequest, PasswordSmsRequest, UserIdSmsRequest } from 'domain/auth/request/auth-user-info.request';
import { PasswordSmsResponse, UserIdSmsResponse } from 'domain/auth/response/auth-user-info.response';
import { BaseResponse } from '../../utils/generics/base.response';
import { LoginRequest, SocialLoginRequest } from './request/auth-login.request';
import { AuthLoginResponse } from './response/auth-login.response';
@ApiTags('Auth')
@Controller('auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AuthController {
    constructor(@Inject(AuthUseCase) private readonly authUseCase: AuthUseCase) {}
    // GOOGLE
    @Post('login/google')
    @ApiOperation({ summary: 'Google Account Login' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Google Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async googlelogin(@Body() authUserDto: SocialLoginRequest): Promise<BaseResponse<AuthLoginResponse>> {
        return BaseResponse.of(await this.authUseCase.googleLogin(authUserDto));
    }
    // APPLE
    @Post('login/apple')
    @ApiOperation({ summary: 'Apple Account Login' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Apple Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async applelogin(@Body() authUserDto: SocialLoginRequest): Promise<BaseResponse<AuthLoginResponse>> {
        return BaseResponse.of(await this.authUseCase.appleLogin(authUserDto));
    }
    // KAKAO
    @Post('login/kakao')
    @ApiOperation({ summary: 'Kakao Account Login' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Kakao Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async kakaologin(@Body() authUserDto: SocialLoginRequest): Promise<BaseResponse<AuthLoginResponse>> {
        return BaseResponse.of(await this.authUseCase.kakaoLogin(authUserDto));
    }
    // NAVER
    @Post('login/naver')
    @ApiOperation({ summary: 'Naver Account Login' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Naver Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async naverlogin(@Body() authUserDto: SocialLoginRequest): Promise<BaseResponse<AuthLoginResponse>> {
        return BaseResponse.of(await this.authUseCase.kakaoLogin(authUserDto));
    }
    // Normal
    @Post('login')
    @ApiOperation({ summary: 'User Login' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async login(@Body() authUserDto: LoginRequest): Promise<BaseResponse<AuthLoginResponse>> {
        console.log(await hash(authUserDto.password, 10));
        return BaseResponse.of(await this.authUseCase.login(authUserDto));
    }

    @Post('sms/send-otp-request-to-get-userID')
    @ApiOperation({
        summary: 'Send OTP verification to get UserName',
        description: 'This endpoint send sms message to provided phone number to verify the user account to get current UserID.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Send OTP verification successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Name or phone number not found' })
    async sendOTPToGetUserId(@Body() body: UserIdSmsRequest): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.authUseCase.sendOtp(body, false));
    }

    @Post('sms/send-otp-request-to-get-password')
    @ApiOperation({
        summary: 'Send OTP verification to get Password',
        description: 'his endpoint send sms message to provided phone number to verify the user account to get current password.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Send OTP verification successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Name or phone number or userName not found' })
    async sendOTPToGetPassword(@Body() body: PasswordSmsRequest): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.authUseCase.sendOtp(body, true));
    }

    @Post('sms/verify-otp-to-get-userId')
    @ApiOperation({
        summary: 'Verify OTP code',
        description: 'This endpoint will verify the given OTP code from user to get userName.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Verify OTP successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Verify OTP failed' })
    async verifyOTPToGetUserID(
        @Body() body: OtpVerificationRequest,
    ): Promise<BaseResponse<UserIdSmsResponse | PasswordSmsResponse>> {
        return BaseResponse.of(await this.authUseCase.verifyOtp(body, false));
    }

    @Post('sms/verify-otp-to-get-password')
    @ApiOperation({
        summary: 'Verify OTP code',
        description: 'This endpoint will verify the given OTP code from user to get password.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Verify OTP successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Verify OTP failed' })
    async verifyOTPToGetPassword(@Body() body: OtpVerificationRequest): Promise<any> {
        return BaseResponse.of(await this.authUseCase.verifyOtp(body, true));
    }
}
