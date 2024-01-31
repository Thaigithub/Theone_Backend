import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { ApplicationCompanyGetDetailMemberResponse } from 'domain/application/company/response/application-company-get-detail-member.response';
import { ApplicationCompanyGetDetailTeamResponse } from 'domain/application/company/response/application-company-get-detail-team.response';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { InterviewCompanyService } from './interview-company.service';
import { InterviewCompanyProposeRequest } from './request/interview-company-create.request';
import { InterviewCompanyGetListRequest } from './request/interview-company-get-list.request';
import { InterviewCompanyUpdateStatusRequest } from './request/interview-company-update-status.request';
import { InterviewCompanyGetListResponse } from './response/interview-company-get-list.response';

@Controller('/company/interviews')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class InterviewCompanyController {
    constructor(private interviewCompanyService: InterviewCompanyService) {}

    @Get()
    async getList(
        @Req() request: BaseRequest,
        @Query() query: InterviewCompanyGetListRequest,
    ): Promise<BaseResponse<InterviewCompanyGetListResponse>> {
        return BaseResponse.of(await this.interviewCompanyService.getList(request.user.accountId, query));
    }

    @Get('/:id/member')
    async getDetailMember(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ApplicationCompanyGetDetailMemberResponse>> {
        return BaseResponse.of(await this.interviewCompanyService.getDetailMember(request.user.accountId, id));
    }

    @Get('/:id/team')
    async getDetailTeam(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ApplicationCompanyGetDetailTeamResponse>> {
        return BaseResponse.of(await this.interviewCompanyService.getDetailTeam(request.user.accountId, id));
    }

    @Patch('/:id/status')
    async updateStatus(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: InterviewCompanyUpdateStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.interviewCompanyService.updateStatus(request.user.accountId, id, body.status));
    }

    @Post()
    async create(@Body() body: InterviewCompanyProposeRequest, @Req() request: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.interviewCompanyService.create(body, request.user.accountId));
    }
}
