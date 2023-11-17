import { Body, Controller, Get, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDTO } from '../../application/dtos/user.dto';
import { UserUseCase } from '../../application/use-cases/user.use-case';
import { UpsertUserRequest } from '../requests/upsert-user.request';
import { BaseResponse } from '../responses/base.response';

@ApiTags('Users')
@Controller('users')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class UserController {
  constructor(@Inject(UserUseCase) private readonly userUseCase: UserUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Find users',
    description: 'This endpoint retrieves a list of all users in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async getUsers(): Promise<UserDTO[]> {
    return await this.userUseCase.getUsers();
  }

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: 'This endpoint creates a user in the system',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async createUser(@Body() request: UpsertUserRequest): Promise<void> {
    await this.userUseCase.createUser(request);
  }
}
