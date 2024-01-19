import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { HeadhuntingCompanyService } from './headhunting-company.service';
import { HeadhuntingGetListRecommendationRequest } from './request/headhunting-company-get-list-recommendation.request';
import { RecommendationCompanyGetListHeadhuntingApprovedResponse } from './response/headhunting-company-get-list-recommendation.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('/company/headhunting')
export class HeadhuntingCompanyController {
    constructor(private readonly headhuntingCompanyService: HeadhuntingCompanyService) {}

    @Get('/post/:postId/recommendation')
    async getListRecommendation(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() request: AccountIdExtensionRequest,
        @Query() query: HeadhuntingGetListRecommendationRequest,
    ): Promise<BaseResponse<RecommendationCompanyGetListHeadhuntingApprovedResponse>> {
        return BaseResponse.of(await this.headhuntingCompanyService.getListRecommendation(request.user.accountId, postId, query));
    }

    @Get('/post/:postId/request')
    async getDetailRequest(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<any>> {
        return BaseResponse.of(await this.headhuntingCompanyService.getDetailRequest(request.user.accountId, postId));
    }
}
