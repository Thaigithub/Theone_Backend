import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator';
import { RecommendationCompanyGetListHeadhuntingApprovedRequest } from '../admin/request/recommendation-company-get-list-headhunting-approved.request';
import {
    RecommendationCompanyGetItemHeadhuntingApprovedResponse,
    RecommendationCompanyGetListHeadhuntingApprovedResponse,
} from '../admin/response/recommendation-company-get-list-headhunting-approved.response';
import { HeadhuntingCompanyService } from './headhunting-company.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@Controller('company/headhunting')
@ApiTags('[COMPANY] Headhunting Management')
export class HeadhuntingCompanyController {
    constructor(private readonly headhuntingCompanyService: HeadhuntingCompanyService) {}

    @Get(':postId/recommendation')
    @ApiOperation({
        summary: 'Listing recommendation applicants',
        description: 'Company can view list applicants recommended by Admin',
    })
    @ApiOkResponsePaginated(RecommendationCompanyGetItemHeadhuntingApprovedResponse)
    async getListRecommendation(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() request: any,
        @Query() query: RecommendationCompanyGetListHeadhuntingApprovedRequest,
    ): Promise<BaseResponse<RecommendationCompanyGetListHeadhuntingApprovedResponse>> {
        const recommendationApplicants = await this.headhuntingCompanyService.getListRecommendation(
            request.user.accountId,
            postId,
            query,
        );
        return BaseResponse.of(recommendationApplicants);
    }

    @Get(':postId/request')
    @ApiOperation({
        summary: 'Detail of Headhunting request of a post',
        description: 'Company can view detail of Headhunting request of a post',
    })
    async getDetailRequest(@Param('postId', ParseIntPipe) postId: number, @Req() request: any): Promise<BaseResponse<any>> {
        const recommendationApplicants = await this.headhuntingCompanyService.getDetailRequest(request.user.accountId, postId);
        return BaseResponse.of(recommendationApplicants);
    }
}
