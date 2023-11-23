import { Controller, Post, Body, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse } from '@nestjs/swagger';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { LoginRequest } from 'presentation/requests/login.request';
import { BaseResponse } from 'presentation/responses/base.response';
import { LoginResponse } from 'presentation/responses/login.response';

@ApiTags('Auth')
@Controller('auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AuthController {
  constructor(@Inject(AuthUseCase) private readonly authUseCase: AuthUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Account Login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Account logged in successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async login(@Body() authUserDto: LoginRequest): Promise<BaseResponse<LoginResponse>> {
    return BaseResponse.of(await this.authUseCase.login(authUserDto));
  }

  @Post('sms/send-otp-request-to-get-userID')
  @ApiOperation({
    summary: 'Send OTP verification',
    description: 'This endpoint send sms message to provided phone number to verify the user account to get current UserID.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Send OTP verification successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid credentials' })
  async sendOTPToGetUserId(@Body() body: UserIdSmsRequest): Promise<any> {
    try {
      const result = await this.authUseCase.sendOtpSms(body,false);
      return { success: true, message: 'SMS sent successfully', result };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }

  @Post('sms/send-otp-request-to-get-password')
  @ApiOperation({
    summary: 'Send sms message',
    description: 'This endpoint send sms message to provided phone number.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Send OTP verification successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async sendOTPToGetPassword(@Body() body: PasswordSmsRequest): Promise<any> {
    try {
      const result = await this.authUseCase.sendOtpSms(body,true);
      return { success: true, message: 'SMS sent successfully', result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('sms/verify-otp-to-get-userId')
  @ApiOperation({
    summary: 'Verify OTP code',
    description: 'This endpoint will verify the given OTP code from user.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async verifyOTPToGetUserID(@Body() body: OTPVerificationRequest): Promise<any> {
    try {
      const result = await this.authUseCase.verifyOtp(body,false);
      return { success: true, message: 'SMS sent successfully', result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }


  @Post('sms/verify-otp-to-get-password')
  @ApiOperation({
    summary: 'Verify OTP code',
    description: 'This endpoint will verify the given OTP code from user.',
  })
  @ApiResponse({ status: HttpStatus.OK,description: 'User send ' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async verifyOTPToGetPassword(@Body() body: OTPVerificationRequest): Promise<any> {
    try {
      const result = await this.authUseCase.verifyOtp(body,true);
      return { success: true, message: 'SMS sent successfully', result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }


}
