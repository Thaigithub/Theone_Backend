import { Controller, Post, Body, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse } from '@nestjs/swagger';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { LoginRequest } from 'presentation/requests/login.request';
import { OtpVerificationRequest, PasswordSmsRequest, UserIdSmsRequest } from 'presentation/requests/user-info.request';
import { BaseResponse } from 'presentation/responses/base.response';
import { LoginResponse } from 'presentation/responses/login.response';
import { PasswordSmsResponse, UserIdSmsResponse } from 'presentation/responses/user-info.request';

@ApiTags('Auth')
@Controller('auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AuthController {
  constructor(@Inject(AuthUseCase) private readonly authUseCase: AuthUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async login(@Body() authUserDto: LoginRequest): Promise<BaseResponse<LoginResponse>> {
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
  async verifyOTPToGetUserID(@Body() body: OtpVerificationRequest): Promise<BaseResponse<UserIdSmsResponse | PasswordSmsResponse>> {
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
