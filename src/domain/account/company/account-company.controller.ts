import { Controller, Get, HttpStatus, Param, Post, Body } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { AccountCompanyService } from './account-company.service';
import { CompanyAccountSignupRequest } from './request/account-company-signup.request';

@ApiTags('[COMPANY] Accounts')
@Controller('/company/accounts')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AccountCompanyController {
    constructor(private accountCompanyService: AccountCompanyService) {}
    @Post('signup')
    @ApiOperation({
        summary: 'Company Signup',
        description: 'This endpoint to company signup normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User signed up successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid information' })
    async signup(@Body() body: CompanyAccountSignupRequest): Promise<BaseResponse<null>> {
        await this.accountCompanyService.signup(body);
        return BaseResponse.ok();
    }
    @Get('/bussinessRegNum/:businessRegNum/check')
    @ApiOperation({
        summary: 'Company Signup',
        description: 'This endpoint to company signup normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User result' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid information' })
    async checkBusinessReg(@Param('businessRegNum') businessRegNum: string): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.accountCompanyService.checkBusinessRegNum(businessRegNum));
    }

    @Get(':username/check')
    @ApiOperation({
        summary: 'Company username check',
        description: 'This endpoint to company check username.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User result' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid information' })
    async accountMemberCheck(@Param('username') username: string): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.accountCompanyService.accountCompanyCheck(username));
    }
}
