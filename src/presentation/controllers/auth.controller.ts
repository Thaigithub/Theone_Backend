import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthUserDto } from 'application/dtos/auth.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse } from '@nestjs/swagger';
import { AuthUseCase } from 'application/use-cases/auth.use-case';

@ApiTags('Auth')
@Controller('auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async login(@Body() authUserDto: AuthUserDto) {
    return await this.authUseCase.login(authUserDto);
  }
}
