import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { HeadhuntingCompanyService } from './headhunting-company.service';
import { HeadhuntingCompanyCreateRequestRequest } from './request/headhunting-company-create-request.request';
import { HeadhuntingCompanyGetListRecommendationRequest } from './request/headhunting-company-get-list-recommendation.request';
import { HeadhuntingCompanyGetDetailRequestResponse } from './response/headhunting-company-get-detail-request.response';
import { HeadhuntingCompanyGetListRecommendationResponse } from './response/headhunting-company-get-list-recommendation.response';
import { HeadhuntingCompanyGetRecommendationDetailResponse } from './response/headhunting-company-get-recommendation-detail.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('/company/headhunting')
export class HeadhuntingCompanyController {
    constructor(private headhuntingCompanyService: HeadhuntingCompanyService) {}

    @Get('/:id/recommendation')
    async getListRecommendation(
        @Param('id', ParseIntPipe) postId: number,
        @Req() request: BaseRequest,
        @Query() query: HeadhuntingCompanyGetListRecommendationRequest,
    ): Promise<BaseResponse<HeadhuntingCompanyGetListRecommendationResponse>> {
        return BaseResponse.of(await this.headhuntingCompanyService.getListRecommendation(request.user.accountId, postId, query));
    }

    @Get('/:id/request')
    async getDetailRequest(
        @Param('id', ParseIntPipe) postId: number,
        @Req() request: BaseRequest,
    ): Promise<BaseResponse<HeadhuntingCompanyGetDetailRequestResponse>> {
        return BaseResponse.of(await this.headhuntingCompanyService.getDetailRequest(request.user.accountId, postId));
    }

    @Post('/:id/request')
    async createRequest(
        @Req() request: BaseRequest,
        @Body() body: HeadhuntingCompanyCreateRequestRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.headhuntingCompanyService.createRequest(request.user.accountId, body, id));
    }

    @Get('/recommendation/:id')
    async getRecommendationDetail(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<HeadhuntingCompanyGetRecommendationDetailResponse>> {
        return BaseResponse.of(await this.headhuntingCompanyService.getRecommendationDetail(req.user.accountId, id));
    }
}
