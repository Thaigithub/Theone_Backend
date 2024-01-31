import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { HeadhuntingAdminService } from './headhunting-admin.service';
import { HeadhuntingAdminCreateRecommendationRequest } from './request/headhunting-admin-create-recommendation.request';
import { HeadhuntingAdminGetListRequestRequest } from './request/headhunting-admin-get-list-request.request';
import { HeadhuntingAdminGetListRequest } from './request/headhunting-admin-get-list.request';
import { HeadhuntingAdminUpdatePaymentRequest } from './request/headhunting-admin-update-payment.request';
import { HeadhuntingAdminUpdateRequestStatusRequest } from './request/headhunting-admin-update-request-status.request';
import { HeadhuntingAdminGetDetailRequestResponse } from './response/headhunting-admin-get-detail-request.response';
import { HeadhuntingAdminGetDetailResponse } from './response/headhunting-admin-get-detail.response';
import { HeadhuntingAdminGetListRequestResponse } from './response/headhunting-admin-get-list-request.response';
import { HeadhuntingAdminGetListResponse } from './response/headhunting-admin-get-list.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('admin/headhunting')
export class HeadhuntingAdminController {
    constructor(private headhuntingAdminService: HeadhuntingAdminService) {}

    @Get()
    async getList(@Query() query: HeadhuntingAdminGetListRequest): Promise<BaseResponse<HeadhuntingAdminGetListResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getList(query));
    }

    @Get('/request')
    async getListRequest(
        @Query() query: HeadhuntingAdminGetListRequestRequest,
    ): Promise<BaseResponse<HeadhuntingAdminGetListRequestResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getListRequest(query));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<HeadhuntingAdminGetDetailResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getDetail(id));
    }

    @Patch('/request/:id/status')
    async updateRequestStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: HeadhuntingAdminUpdateRequestStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.headhuntingAdminService.updateRequestStatus(id, body));
    }

    @Post('/:id/recommendation')
    async createRecommendation(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: HeadhuntingAdminCreateRecommendationRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.headhuntingAdminService.createRecommendation(id, body));
    }

    @Patch('/:id/payment')
    async upddatePayment(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: HeadhuntingAdminUpdatePaymentRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.headhuntingAdminService.updatePayment(id, body));
    }

    @Get('/request/:id')
    async getDetailRequest(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<HeadhuntingAdminGetDetailRequestResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getDetailRequest(id));
    }
}
