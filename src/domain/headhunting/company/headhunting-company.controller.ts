import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';

import { HeadhuntingGetListRecommendationRequest } from './request/headhunting-company-get-list-recommendation.request';

import { HeadhuntingCompanyService } from './headhunting-company.service';
import { RecommendationCompanyGetListHeadhuntingApprovedResponse } from './response/headhunting-company-get-list-recommendation.response';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@Controller('/company/headhunting')
@ApiTags('[COMPANY] Headhunting Management')
export class HeadhuntingCompanyController {
    constructor(private readonly headhuntingCompanyService: HeadhuntingCompanyService) {}

    @Get('/:postId/recommendation')
    @ApiOperation({
        summary: 'Listing recommendation applicants',
        description: 'Company can view list applicants recommended by Admin',
    })
    async getListRecommendation(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() request: AccountIdExtensionRequest,
        @Query() query: HeadhuntingGetListRecommendationRequest,
    ): Promise<BaseResponse<RecommendationCompanyGetListHeadhuntingApprovedResponse>> {
        const recommendationApplicants = await this.headhuntingCompanyService.getListRecommendation(
            request.user.accountId,
            postId,
            query,
        );
        return BaseResponse.of(recommendationApplicants);
    }

    @Get('/:postId/request')
    @ApiOperation({
        summary: 'Detail of Headhunting request of a post',
        description: 'Company can view detail of Headhunting request of a post',
    })
    async getDetailRequest(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<any>> {
        const recommendationApplicants = await this.headhuntingCompanyService.getDetailRequest(request.user.accountId, postId);
        return BaseResponse.of(recommendationApplicants);
    }
}
