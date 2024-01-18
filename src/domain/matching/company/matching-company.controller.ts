import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { MatchingCompanyService } from './matching-company.service';
import { MatchingCompanyGetListRecommendationRequest } from './request/matching-company-get-list-recommendation.request';
import { MatchingCompanyGetListRecommendation } from './response/matching-company-get-list-recommendation.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('/company/matching')
export class MatchingCompanyController {
    constructor(private readonly matchingCompanyService: MatchingCompanyService) {}

    @Get()
    async getList(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: MatchingCompanyGetListRecommendationRequest,
    ): Promise<BaseResponse<MatchingCompanyGetListRecommendation>> {
        return BaseResponse.of(await this.matchingCompanyService.getList(req.user.accountId, query));
    }
}
