import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
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
        summary: 'Signup',
        description: 'This endpoint to member signup normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User signed up successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid information' })
    async signup(@Body() request: MemberAccountSignupRequest): Promise<BaseResponse<null>> {
        await this.accountMemberService.signup(request);
        return BaseResponse.ok();
    }
}
