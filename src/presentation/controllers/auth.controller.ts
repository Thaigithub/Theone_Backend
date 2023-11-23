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
}
