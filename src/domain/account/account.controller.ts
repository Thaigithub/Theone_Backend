import { Body, Controller, Get, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FunctionName } from '@prisma/client';
import { GetAccountResponse } from 'domain/account/response/account-get.response';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthPermissionGuard, FunctionPermission } from 'domain/auth/auth-permission.guard';
import { BaseResponse } from '../../utils/generics/base.response';
import { AccountUseCase } from './account.use-case';
import { AccountUpsertRequest } from './request/account-upsert.request';

@ApiTags('Accounts')
@Controller('accounts')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AccountController {
    constructor(@Inject(AccountUseCase) private readonly accountUseCase: AccountUseCase) {}

    @Get()
    @FunctionPermission(FunctionName.MEMBER_MANAGEMENT)
    @UseGuards(AuthJwtGuard, AuthPermissionGuard)
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
    async createAccount(@Body() request: AccountUpsertRequest): Promise<void> {
        await this.accountUseCase.createAccount(request);
    }
}
