import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { MatchingCompanyService } from './matching-company.service';
import { MatchingCompanyGetListRecommendationRequest } from './request/matching-company-get-list-recommendation.request';
import { MatchingCompanyGetListRecommendation } from './response/matching-company-get-list-recommendation.response';
import { MatchingCompanyCreateRecommendationRequest } from './request/matching-company-create-recommendation.request';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('/company/matchings')
export class MatchingCompanyController {
    constructor(private matchingCompanyService: MatchingCompanyService) {}

    @Get()
    async getList(
        @Req() req: BaseRequest,
        @Query() query: MatchingCompanyGetListRecommendationRequest,
    ): Promise<BaseResponse<MatchingCompanyGetListRecommendation>> {
        return BaseResponse.of(await this.matchingCompanyService.getList(req.user.accountId, query));
    }

    @Post()
    async create(
        @Req() req: BaseRequest,
        @Body() query: MatchingCompanyCreateRecommendationRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.matchingCompanyService.create(req.user.accountId, query));
    }
}
