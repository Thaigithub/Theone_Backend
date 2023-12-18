import { Controller, Get, HttpStatus, Param, ParseIntPipe, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType, InterviewStatus, RequestObject, SupportCategory } from '@prisma/client';
import { ApplicationCompanyGetMemberDetail } from 'domain/application/company/response/application-company-get-member-detail.response';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { TeamCompanyGetTeamDetailApplicants } from 'domain/team/company/response/team-company-get-team-detail.response';
import { BaseResponse } from 'utils/generics/base.response';
import { InterviewCompanySearchCategories } from './dto/interview-company-search-category.enum';

import { InterviewCompanyService } from './interview-company.service';
import { InterviewCompantGetListRequest } from './request/interview-company-get-list.request';
import { InterviewCompanyGetItemResponse } from './response/interview-company-get-item.response';

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
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({
        name: 'object',
        type: String,
        required: false,
        description: 'Object for filter: ' + Object.values(RequestObject),
    })
    @ApiQuery({
        name: 'supportCategory',
        type: String,
        required: false,
        description: 'Support Category for filter: ' + Object.values(SupportCategory),
    })
    @ApiQuery({
        name: 'interviewStatus',
        type: String,
        required: false,
        description: 'Interview Status for filter: ' + Object.values(InterviewStatus),
    })
    @ApiQuery({ name: 'interviewRequestStartDate', type: String, required: false, description: 'Interview request start date' })
    @ApiQuery({ name: 'interviewRequestEndDate', type: String, required: false, description: 'Interview request end date' })
    @ApiQuery({ name: 'keyword', type: String, required: false, description: 'Keyword for search' })
    @ApiQuery({
        name: 'searchCategory',
        type: String,
        required: false,
        description: 'Category for search: ' + Object.values(InterviewCompanySearchCategories),
    })
    async getList(
        @Req() request: any,
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
        @Req() request: any,
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
        @Req() request: any,
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
    async passInteview(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
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
    async failInteview(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        const posts = await this.interviewCompanyService.resultInterview(request.user.accountId, id, InterviewStatus.FAIL);
        return BaseResponse.of(posts);
    }
}
