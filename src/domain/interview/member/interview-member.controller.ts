import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
