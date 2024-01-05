import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

@ApiTags('[COMPANY] Interview Management')
@Controller('/company/interviews')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
export class InterviewCompanyController {
    constructor(private readonly interviewCompanyService: InterviewCompanyService) {}

    @Get()
    @ApiOperation({
        summary: 'Listing interviews',
        description: 'Company can search/filter/paging interviews',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The interviews list retrieved successfully',
        type: InterviewCompanyGetItemResponse,
    })
    async getList(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: InterviewCompantGetListRequest,
    ): Promise<BaseResponse<InterviewCompanyGetItemResponse>> {
        const interviews = await this.interviewCompanyService.getList(request.user.accountId, query);
        return BaseResponse.of(interviews);
    }

    @Get('/:id/member')
    @ApiOperation({
        summary: 'Member detail',
        description: 'Retrieve member information detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ApplicationCompanyGetMemberDetail,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getMemberDetail(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ApplicationCompanyGetMemberDetail>> {
        return BaseResponse.of(await this.interviewCompanyService.getMemberDetail(request.user.accountId, id));
    }

    @Get('/:id/team')
    @ApiOperation({
        summary: 'Team detail',
        description: 'Retrieve team information detail of a interview',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: TeamCompanyGetTeamDetailApplicants,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getTeamDetail(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<TeamCompanyGetTeamDetailApplicants>> {
        return BaseResponse.of(await this.interviewCompanyService.getTeamDetail(request.user.accountId, id));
    }

    @Put('/:id/pass')
    @ApiOperation({
        summary: 'Pass job interview',
        description: 'Company can decide pass a job interview',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async passInteview(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        const posts = await this.interviewCompanyService.resultInterview(request.user.accountId, id, InterviewStatus.PASS);
        return BaseResponse.of(posts);
    }

    @Put('/:id/fail')
    @ApiOperation({
        summary: 'Fail job interview',
        description: 'Company can decide fail a job interview',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async failInteview(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        const posts = await this.interviewCompanyService.resultInterview(request.user.accountId, id, InterviewStatus.FAIL);
        return BaseResponse.of(posts);
    }

    @Post('manpower')
    @ApiOperation({
        summary: 'Propose member or team interview',
        description: 'Company can create an interview proposal for member or team',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async proposeTeamInterview(@Body() body: InterviewCompanyProposeRequest): Promise<BaseResponse<null>> {
        await this.interviewCompanyService.proposeInterview(body);
        return BaseResponse.ok();
    }
}
