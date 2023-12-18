import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { AccountMemberService } from './account-member.service';
import { AccountMemberCheckUsernameExistenceResponse } from './response/account-member-check-exist-accountId.response';
import { MemberAccountSignupRequest } from './resquest/account-member-signup.request';

@ApiTags('[MEMBER] Accounts Management')
@Controller('/member/accounts')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AccountMemberController {
    constructor(private accountMemberService: AccountMemberService) {}

    @Post('/signup')
    @ApiOperation({
        summary: 'Member Signup',
        description: 'This endpoint to member signup normally.',
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User signed up successfully', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Username has been used', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Recommender username not found', type: BaseResponse })
    async signup(@Body() request: MemberAccountSignupRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.signup(request));
    }

    @Get('/:username/check')
    @ApiOperation({
        summary: 'Member check',
        description: 'This endpoint to member check username.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Member username checked', type: Boolean })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Missing the parameter', type: BaseResponse })
    async accountMemberCheck(
        @Param('username') username: string,
    ): Promise<BaseResponse<AccountMemberCheckUsernameExistenceResponse>> {
        return BaseResponse.of(await this.accountMemberService.accountMemberCheck(username));
    }

    @Get('/recommender/:username/check')
    @ApiOperation({
        summary: 'Member check',
        description: 'This endpoint to member signup normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Recommender username checked', type: Boolean })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Missing the parameter', type: BaseResponse })
    async accountRecommenderCheck(
        @Param('username') username: string,
    ): Promise<BaseResponse<AccountMemberCheckUsernameExistenceResponse>> {
        return BaseResponse.of(await this.accountMemberService.accountRecommenderCheck(username));
    }
}
