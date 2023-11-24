import { Body, Controller, Get, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountUseCase } from '../../application/use-cases/account.use-case';
import { UpsertAccountRequest } from '../requests/upsert-account.request';
import { BaseResponse } from '../responses/base.response';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { GetAccountResponse } from 'presentation/responses/get-account.response';
import { Roles, RolesGuard } from 'infrastructure/passport/guards/roles.guard';
import { AccountType } from '@prisma/client'
@ApiTags('Accounts')
@Controller('accounts')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AccountController {
  constructor(@Inject(AccountUseCase) private readonly accountUseCase: AccountUseCase) {}

  @Get()
  @Roles(AccountType.MEMBER)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseGuards(JWTAuthGuard)
  @ApiOperation({
    summary: 'Find accounts',
    description: 'This endpoint retrieves a list of all accounts in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async getAccounts(): Promise<BaseResponse<GetAccountResponse>> {
    return BaseResponse.of(new GetAccountResponse(await this.accountUseCase.getAccounts()));
  }

  @Post()
  @ApiOperation({
    summary: 'Create account',
    description: 'This endpoint creates a account in the system',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async createAccount(@Body() request: UpsertAccountRequest): Promise<void> {
    await this.accountUseCase.createAccount(request);
  }
}
