import { Body, Req, Controller, Get, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { BaseResponse } from '../responses/base.response';
import { AuthGuard } from '@nestjs/passport'

@ApiTags('Auth')
@Controller('auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AuthController {
  constructor(@Inject(AuthUseCase) private readonly authUseCase: AuthUseCase) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google login',
    description: 'This endpoint logins with google account',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async googleAuth(@Req() req) { console.log('Hello')}

  @Get('/login/google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google login callback',
    description: 'This callback endpoint logging with google account',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async googleAuthRedirect(@Req() req) {
    await this.authUseCase.googleLogin(req);
  }
}
