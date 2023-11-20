import { Body, Controller, Get, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { UpsertUserRequest } from '../requests/upsert-user.request';
import { BaseResponse } from '../responses/base.response';

@ApiTags('Auth')
@Controller('Auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AuthController {
  constructor(@Inject(AuthUseCase) private readonly authUseCase: AuthUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Find users',
    description: 'This endpoint retrieves a list of all users in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async getUsers() {
  }
}
