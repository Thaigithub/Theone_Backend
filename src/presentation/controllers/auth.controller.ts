import { Body, Post, Controller, Get, HttpStatus, Inject, UseGuards, Res } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { BaseResponse } from '../responses/base.response';
import { LoginRequest, SocialLoginRequest } from '../requests/login.request';
import { LoginResponse } from '../responses/login.response';

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
  async googlelogin(@Body() authUserDto: SocialLoginRequest): Promise<BaseResponse<LoginResponse>> {
    return BaseResponse.of(await this.authUseCase.googleLogin(authUserDto));
  }
  // APPLE
  @Post('login/apple')
  @ApiOperation({ summary: 'Apple Account Login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Apple Account logged in successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async applelogin(@Body() authUserDto: SocialLoginRequest): Promise<BaseResponse<LoginResponse>> {
    return BaseResponse.of(await this.authUseCase.appleLogin(authUserDto));
  }
  // KAKAO
  @Post('login/kakao')
  @ApiOperation({ summary: 'Kakao Account Login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Kakao Account logged in successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async kakaologin(@Body() authUserDto: SocialLoginRequest): Promise<BaseResponse<LoginResponse>> {
    return BaseResponse.of(await this.authUseCase.kakaoLogin(authUserDto));
  }
  // NAVER
  @Post('login/naver')
  @ApiOperation({ summary: 'Naver Account Login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Naver Account logged in successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async naverlogin(@Body() authUserDto: SocialLoginRequest): Promise<BaseResponse<LoginResponse>> {
    return BaseResponse.of(await this.authUseCase.kakaoLogin(authUserDto));
  }
  // Normal
  @Post('login')
  @ApiOperation({ summary: 'Account Login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Account logged in successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async login(@Body() authUserDto: LoginRequest): Promise<BaseResponse<LoginResponse>> {
    return BaseResponse.of(await this.authUseCase.login(authUserDto));
  }
}
