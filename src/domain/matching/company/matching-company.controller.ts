import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType, SupportCategory } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { RecommendationCompanyService } from 'domain/recommendation/company/recommendation.service';
import { RecommendationCompanyInterviewProposeRequest } from 'domain/recommendation/company/request/recommendaation-company-interview-proposed.request';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { MatchingCompanyService } from './matching-company.service';
import { MatchingCompanyGetListRecommendationRequest } from './request/matching-company-get-list-recommendation.request';
import { MatchingCompanyGetListRecommendation } from './response/matching-company-get-list-recommendation.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('company/matching')
export class MatchingCompanyController {
    constructor(
        private readonly matchingCompanyService: MatchingCompanyService,
        private readonly recommendationCompanyService: RecommendationCompanyService,
    ) {}

    @Get()
    async getList(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: MatchingCompanyGetListRecommendationRequest,
    ): Promise<BaseResponse<MatchingCompanyGetListRecommendation>> {
        const code = await this.matchingCompanyService.getList(req.user.accountId, query);
        return BaseResponse.of(code);
    }

    @Put('/:applicantId/propose')
    async proposeInteview(
        @Req() request: AccountIdExtensionRequest,
        @Param('applicantId', ParseIntPipe) applicationId: number,
        @Body() body: RecommendationCompanyInterviewProposeRequest,
    ): Promise<BaseResponse<void>> {
        const posts = await this.recommendationCompanyService.proposeInterview(
            request.user.accountId,
            applicationId,
            SupportCategory.MATCHING,
            body,
        );
        return BaseResponse.of(posts);
    }
}
