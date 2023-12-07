import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { AccountMemberService } from './account-member.service';
import { MemberAccountSignupRequest } from './resquest/account-member-signup.request';

@ApiTags('[MEMBER] Accounts')
@Controller('/member/accounts')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AccountMemberController {
    constructor(private accountMemberService: AccountMemberService) {}

    @Post('signup')
    @ApiOperation({
        summary: 'Member Signup',
        description: 'This endpoint to member signup normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User signed up successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid information' })
    async signup(@Body() request: MemberAccountSignupRequest): Promise<BaseResponse<null>> {
        await this.accountMemberService.signup(request);
        return BaseResponse.ok();
    }

    @Get(':username/check')
    @ApiOperation({
        summary: 'Member check',
        description: 'This endpoint to member check username.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User result' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid information' })
    async accountMemberCheck(@Param('username') username: string): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.accountMemberService.accountMemberCheck(username));
    }

    @Get('/recommender/:username/check')
    @ApiOperation({
        summary: 'Member check',
        description: 'This endpoint to member signup normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User result' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid information' })
    async accountRecommenderCheck(@Param('username') username: string): Promise<BaseResponse<boolean>> {
        return BaseResponse.of(await this.accountMemberService.accountRecommenderCheck(username));
    }
}
