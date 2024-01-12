import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType, InterviewStatus } from '@prisma/client';
import { ApplicationCompanyGetMemberDetail } from 'domain/application/company/response/application-company-get-member-detail.response';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { TeamCompanyGetTeamDetailApplicants } from 'domain/team/company/response/team-company-get-team-detail.response';
import { BaseResponse } from 'utils/generics/base.response';

import { InterviewCompanyService } from './interview-company.service';
import { InterviewCompantGetListRequest } from './request/interview-company-get-list.request';
import { InterviewCompanyGetItemResponse } from './response/interview-company-get-item.response';
import { InterviewCompanyProposeRequest } from './request/interview-company-propose.request';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';

@Controller('/company/interviews')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class InterviewCompanyController {
    constructor(private readonly interviewCompanyService: InterviewCompanyService) {}

    @Get()
    async getList(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: InterviewCompantGetListRequest,
    ): Promise<BaseResponse<InterviewCompanyGetItemResponse>> {
        const interviews = await this.interviewCompanyService.getList(request.user.accountId, query);
        return BaseResponse.of(interviews);
    }

    @Get('/:id/member')
    async getMemberDetail(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ApplicationCompanyGetMemberDetail>> {
        return BaseResponse.of(await this.interviewCompanyService.getMemberDetail(request.user.accountId, id));
    }

    @Get('/:id/team')
    async getTeamDetail(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<TeamCompanyGetTeamDetailApplicants>> {
        return BaseResponse.of(await this.interviewCompanyService.getTeamDetail(request.user.accountId, id));
    }

    @Put('/:id/pass')
    async passInteview(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        const posts = await this.interviewCompanyService.resultInterview(request.user.accountId, id, InterviewStatus.PASS);
        return BaseResponse.of(posts);
    }

    @Put('/:id/fail')
    async failInteview(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        const posts = await this.interviewCompanyService.resultInterview(request.user.accountId, id, InterviewStatus.FAIL);
        return BaseResponse.of(posts);
    }

    @Post('manpower')
    async proposeTeamInterview(
        @Body() body: InterviewCompanyProposeRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        await this.interviewCompanyService.proposeInterview(body, request.user.accountId);
        return BaseResponse.ok();
    }
}
