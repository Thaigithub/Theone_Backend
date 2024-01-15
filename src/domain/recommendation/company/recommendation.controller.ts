import { Body, Controller, Get, Param, ParseIntPipe, Put, Req, UseGuards } from '@nestjs/common';
import { AccountType, SupportCategory } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { RecommendationCompanyService } from './recommendation.service';
import { RecommendationCompanyInterviewProposeRequest } from './request/recommendaation-company-interview-proposed.request';
import { RecommendationCompanyGetDetailApplicantResponse } from './response/recommendation-company-get-detail-applicants.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('company/recommendation')
export class RecommendationCompanyController {
    constructor(private readonly recommendationCompanyService: RecommendationCompanyService) {}

    @Put('/:applicantId/propose')
    async proposeInteview(
        @Req() request: AccountIdExtensionRequest,
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

    @Get('/:applicantId/post/:postId/team')
    async getDetailTeam(
        @Req() request: AccountIdExtensionRequest,
        @Param('applicantId', ParseIntPipe) applicationId: number,
        @Param('postId', ParseIntPipe) postId: number,
    ): Promise<BaseResponse<RecommendationCompanyGetDetailApplicantResponse>> {
        const posts = await this.recommendationCompanyService.getDetailApplicants(
            request.user.accountId,
            applicationId,
            postId,
            true,
        );
        return BaseResponse.of(posts);
    }

    @Get('/:applicantId/post/:postId/member')
    async getDetailMember(
        @Req() request: AccountIdExtensionRequest,
        @Param('applicantId', ParseIntPipe) applicationId: number,
        @Param('postId', ParseIntPipe) postId: number,
    ): Promise<BaseResponse<RecommendationCompanyGetDetailApplicantResponse>> {
        const posts = await this.recommendationCompanyService.getDetailApplicants(
            request.user.accountId,
            applicationId,
            postId,
            false,
        );
        return BaseResponse.of(posts);
    }
}
