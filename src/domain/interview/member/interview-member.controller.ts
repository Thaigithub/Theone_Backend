import { Controller, Get, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { InterviewMemberService } from './interview-member.service';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { InterviewMemberGetListRequest } from './request/interview-member-get-list.request';
import { BaseResponse } from 'utils/generics/base.response';
import { InterviewMemberGetListResponse } from './response/interview-member-get-list.response';

@ApiTags('[MEMBER] Interview Management')
@Controller('/member/interviews')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class InterviewMemberController {
    constructor(private interviewMemberService: InterviewMemberService) {}
    @Get()
    async getApplicationList(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: InterviewMemberGetListRequest,
    ): Promise<BaseResponse<InterviewMemberGetListResponse>> {
        return BaseResponse.of(await this.interviewMemberService.getList(request.user.accountId, query));
    }

    @Get('count')
    @ApiOperation({
        summary: 'Get total interviews',
        description: 'Member can retrive total interviews',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: BaseResponse<number>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseResponse,
    })
    async getTotal(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<number>> {
        return BaseResponse.of(await this.interviewMemberService.getTotal(request.user.accountId));
    }
}
