import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { AuthMemberService } from './auth-member.service';
import { AuthMemberLoginRequest } from './request/auth-member-login-normal.request';
import { AuthMemberLoginSocialRequest } from './request/auth-member-login-social.request';
import { PasswordSmsCheckValidRequest, PasswordSmsRequest } from './request/auth-member-sms-password.request';
import { UserIdSmsCheckValidRequest, UserIdSmsRequest } from './request/auth-member-sms-username.request';
import { AuthMemberLoginResponse } from './response/auth-member-login.response';
@ApiTags('[MEMBER] Authenticate')
@Controller('/member/auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AuthMemberController {
    constructor(private readonly memberService: AuthMemberService) {}
    // GOOGLE
    @Post('login/google')
    @ApiOperation({
        summary: 'Google Account Login',
        description: 'This endpoint login with Google acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Google Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async googlelogin(@Body() authUserDto: AuthMemberLoginSocialRequest): Promise<BaseResponse<AuthMemberLoginResponse>> {
        return BaseResponse.of(await this.memberService.googleLogin(authUserDto));
    }
    // APPLE
    @Post('login/apple')
    @ApiOperation({
        summary: 'Apple Account Login',
        description: 'This endpoint login with Apple acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Apple Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async applelogin(@Body() authUserDto: AuthMemberLoginSocialRequest): Promise<BaseResponse<AuthMemberLoginResponse>> {
        return BaseResponse.of(await this.memberService.appleLogin(authUserDto));
    }
    // KAKAO
    @Post('login/kakao')
    @ApiOperation({
        summary: 'Kakao Account Login',
        description: 'This endpoint login with Kakao acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Kakao Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async kakaologin(@Body() authUserDto: AuthMemberLoginSocialRequest): Promise<BaseResponse<AuthMemberLoginResponse>> {
        return BaseResponse.of(await this.memberService.kakaoLogin(authUserDto));
    }
    // NAVER
    @Post('login/naver')
    @ApiOperation({
        summary: 'Naver Account Login',
        description: 'This endpoint login with Naver acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Naver Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async naverlogin(@Body() authUserDto: AuthMemberLoginSocialRequest): Promise<BaseResponse<AuthMemberLoginResponse>> {
        return BaseResponse.of(await this.memberService.kakaoLogin(authUserDto));
    }
    // Normal
    @Post('login')
    @ApiOperation({
        summary: 'Login',
        description: 'This endpoint to login normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async login(@Body() authUserDto: AuthMemberLoginRequest): Promise<BaseResponse<AuthMemberLoginResponse>> {
        // console.log(await hash(authUserDto.password, 10));
        return BaseResponse.of(await this.memberService.login(authUserDto));
    }

    @Post('sms/send-otp-request-to-get-userID')
    @ApiOperation({
        summary: 'Send OTP verification to get UserName',
        description: 'This endpoint send sms message to provided phone number to verify the user account to get current UserID.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Send OTP verification successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Name or phone number not found' })
    async sendOTPToGetUserId(@Body() body: UserIdSmsRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memberService.sendSmsOtp(body, false));
    }

    @Post('sms/send-otp-request-to-get-password')
    @ApiOperation({
        summary: 'Send OTP verification to get Password',
        description: 'his endpoint send sms message to provided phone number to verify the user account to get current password.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Send OTP verification successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Name or phone number or userName not found' })
    async sendOTPToGetPassword(@Body() body: PasswordSmsRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memberService.sendSmsOtp(body, true));
    }

    @Post('sms/verify-otp-to-get-userId')
    @ApiOperation({
        summary: 'Verify OTP code',
        description: 'This endpoint will verify the given OTP code from user to get userName.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Verify OTP successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Verify OTP failed' })
    async verifyOTPToGetUserID(@Body() body: UserIdSmsCheckValidRequest): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.memberService.vertifySmsOtp(body, false));
    }

    @Post('sms/verify-otp-to-get-password')
    @ApiOperation({
        summary: 'Verify OTP code',
        description: 'This endpoint will verify the given OTP code from user to get password.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Verify OTP successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Verify OTP failed' })
    async verifyOTPToGetPassword(@Body() body: PasswordSmsCheckValidRequest): Promise<any> {
        return BaseResponse.of(await this.memberService.vertifySmsOtp(body, true));
    }
}
