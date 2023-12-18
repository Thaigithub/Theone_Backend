import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType, SupportCategory } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator.reponse';
import { RecommendationCompanyService } from './recommendation.service';
import { RecommendationCompanyInterviewProposeRequest } from './request/recommendaation-company-interview-proposed.request';
import { RecommendationCompanyGetListHeadhuntingApprovedRequest } from './request/recommendation-company-get-list-headhunting-approved.request';
import { RecommendationCompanyGetDetailApplicantResponse } from './response/recommendation-company-get-detail-applicants.response';
import {
    RecommendationCompanyGetItemHeadhuntingApprovedResponse,
    RecommendationCompanyGetListHeadhuntingApprovedResponse,
} from './response/recommendation-company-get-list-headhunting-approved.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@Controller('company/recommendation')
@ApiTags('[COMPANY] Applicants Recommendation Management')
export class RecommendationCompanyController {
    constructor(private readonly recommendationCompanyService: RecommendationCompanyService) {}

    @Get(':postId/recommendation')
    @ApiOperation({
        summary: 'Listing recommendation applicants',
        description: 'Company can view list recommendation applicants',
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiOkResponsePaginated(RecommendationCompanyGetItemHeadhuntingApprovedResponse)
    async getList(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() request: any,
        @Query() query: RecommendationCompanyGetListHeadhuntingApprovedRequest,
    ): Promise<BaseResponse<RecommendationCompanyGetListHeadhuntingApprovedResponse>> {
        const recommendationApplicants = await this.recommendationCompanyService.getList(request.user.accountId, postId, query);
        return BaseResponse.of(recommendationApplicants);
    }

    @Put('/:applicantId/propose')
    @ApiOperation({
        summary: 'Propose a job interview',
        description: 'Company can propose a job interview',
    })
    @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async proposeInteview(
        @Req() request: any,
        @Param('applicantId', ParseIntPipe) applicationId: number,
        @Body() body: RecommendationCompanyInterviewProposeRequest,
    ): Promise<BaseResponse<void>> {
        const posts = await this.recommendationCompanyService.proposeInterview(
            request.user.accountId,
            applicationId,
            SupportCategory.HEADHUNTING,
            body,
        );
        return BaseResponse.of(posts);
    }

    @Put('/:applicantId/detail')
    @ApiOperation({
        summary: 'Get detail of applicant',
        description: 'Company can view detail of a applicant',
    })
    @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getDetail(
        @Req() request: any,
        @Param('applicantId', ParseIntPipe) applicationId: number,
        @Body() body: RecommendationCompanyInterviewProposeRequest,
    ): Promise<BaseResponse<RecommendationCompanyGetDetailApplicantResponse>> {
        const posts = await this.recommendationCompanyService.getDetailApplicants(request.user.accountId, applicationId, body);
        return BaseResponse.of(posts);
    }
}
