import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { MatchingCompanyService } from './matching-company.service';
import { MatchingCompanyGetListRecommendationRequest } from './request/matching-company-get-list-recommendation.request';
import { MatchingCompanyGetListRecommendation } from './response/matching-company-get-list-recommendation.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@Controller('company/matching')
@ApiTags('[COMPANY] Matching Management')
export class MatchingCompanyController {
    constructor(private readonly matchingCompanyService: MatchingCompanyService) {}

    @Get()
    async getList(
        @Req() req: any,
        @Query() query: MatchingCompanyGetListRecommendationRequest,
    ): Promise<BaseResponse<MatchingCompanyGetListRecommendation>> {
        const code = await this.matchingCompanyService.getList(req.user.accountId, query);
        return BaseResponse.of(code);
    }
}
