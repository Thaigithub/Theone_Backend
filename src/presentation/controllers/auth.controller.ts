import { Body, Req, Post, Controller, Get, HttpStatus, Inject, UseGuards, Res } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { BaseResponse } from '../responses/base.response';
import { LoginRequest } from '../requests/login.request';
import { LoginResponse } from '../responses/login.response';

@ApiTags('Auth')
@Controller('auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AuthController {
  constructor(@Inject(AuthUseCase) private readonly authUseCase: AuthUseCase) {}
  // GOOGLE
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google login',
    description: 'This endpoint logins with google account',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async googleAuth(@Req() req) {}

  @Get('/login/google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google login callback',
    description: 'This callback endpoint logging with google account',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async googleAuthCallback(@Req() req) {
    return await this.authUseCase.googleLogin(req);
  }
  // KAKAO
  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: 'Kakao login',
    description: 'This endpoint logins with kakao account',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async kakaoAuth(@Res() res) {}

  @Get('/login/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: 'Kakao login callback',
    description: 'This callback endpoint logging with kakao account',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async kakaoAuthCallback(@Req() req) {
    return await this.authUseCase.kakaoLogin(req);
  }

  @Post('login')
  @ApiOperation({ summary: 'Account Login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Account logged in successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async login(@Body() authUserDto: LoginRequest): Promise<BaseResponse<LoginResponse>> {
    return BaseResponse.of(await this.authUseCase.login(authUserDto));
  }
}
