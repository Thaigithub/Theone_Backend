import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { AccountCompanyService } from './account-company.service';
import { AccountCompanySignupRequest } from './request/account-company-signup.request';
import { AccountCompanyCheckExistedResponse } from './response/account-company-check-registration-number.response';
import { AccountCompanyGetDetailResponse } from './response/account-company-get-detail.response';

@Controller('/company/accounts')
export class AccountCompanyController {
    constructor(private accountCompanyService: AccountCompanyService) {}
    @Post('/signup')
    async signup(@Body() body: AccountCompanySignupRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountCompanyService.signup(body));
    }
    @Get('/businessRegNum/:businessRegNum/check')
    async checkBusinessReg(
        @Param('businessRegNum') businessRegNum: string,
    ): Promise<BaseResponse<AccountCompanyCheckExistedResponse>> {
        return BaseResponse.of(await this.accountCompanyService.checkBusinessRegNum(businessRegNum));
    }

    @Get('/username/:username/check')
    async checkUsername(@Param('username') username: string): Promise<BaseResponse<AccountCompanyCheckExistedResponse>> {
        return BaseResponse.of(await this.accountCompanyService.checkUsername(username));
    }

    @Roles(AccountType.COMPANY)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Get()
    async getDetail(@Req() req: any): Promise<BaseResponse<AccountCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.accountCompanyService.getDetail(req.user.accountId));
    }
}
