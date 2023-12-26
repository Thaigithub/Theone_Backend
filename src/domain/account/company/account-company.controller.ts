import { Body, Controller, Get, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { AccountCompanyService } from './account-company.service';
import { AccountCompanySignupRequest } from './request/account-company-signup.request';
import { CompanyCompanyGetDetail } from './response/account-company-get-detail.response';

@ApiTags('[COMPANY] Accounts Management')
@Controller('/company/accounts')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AccountCompanyController {
    constructor(private accountCompanyService: AccountCompanyService) {}
    @Post('/signup')
    @ApiOperation({
        summary: 'Company Signup',
        description: 'This endpoint to company signup normally.',
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User signed up successfully', type: BaseResponse })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Username or Business Registration number has been used',
        type: BaseResponse,
    })
    async signup(@Body() body: AccountCompanySignupRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountCompanyService.signup(body));
    }
    @Get('/bussinessRegNum/:businessRegNum/check')
    @ApiOperation({
        summary: 'Business Registration check',
        description: 'This endpoint to check the existence of the business registration number in the system.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Checked the business registration number',
        type: Boolean,
    })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Missing the parameter', type: BaseResponse })
    async checkBusinessReg(@Param('businessRegNum') businessRegNum: string): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.accountCompanyService.checkBusinessRegNum(businessRegNum));
    }

    @Get('/:username/check')
    @ApiOperation({
        summary: 'Company username check',
        description: 'This endpoint to check the existence of username in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Checked the username', type: Boolean })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Missing the parameter', type: BaseResponse })
    async accountMemberCheck(@Param('username') username: string): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.accountCompanyService.accountCompanyCheck(username));
    }

    @Roles(AccountType.COMPANY)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Get()
    async getDetail(@Req() req: any): Promise<BaseResponse<CompanyCompanyGetDetail>> {
        return BaseResponse.of(await this.accountCompanyService.getDetail(req.user.accountId));
    }
}
