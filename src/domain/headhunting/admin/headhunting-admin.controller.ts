import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { HeadhuntingAdminService } from './headhunting-admin.service';
import {
    HeadhuntingAdminAddMemberRecommendationRequest,
    HeadhuntingAdminAddTeamRecommendationRequest,
} from './request/headhunting-admin-add-recommendation.request';
import { HeadhuntingAdminDenyRequestRequest } from './request/headhunting-admin-deny-request.request';
import { HeadhuntingAdminGetListApprovalRequest } from './request/headhunting-admin-get-list-approval.request';
import {
    HeadhuntingAdminGetListMemberRecommendationRequest,
    HeadhuntingAdminGetListTeamRecommendationRequest,
} from './request/headhunting-admin-get-list-recommendation.request';
import { HeadhuntingAdminGetListRequestRequest } from './request/headhunting-admin-get-list-request.request';
import { HeadhuntingGetDetailApprovalIndividualResponse } from './response/headhunting-admin-get-detail-approval.response';
import { HeadhuntingAdminGetDetailRequestResponse } from './response/headhunting-admin-get-detail-request.response';
import { HeadhuntingGetDetailApprovalTeamResponse } from './response/headhunting-admin-get-detail-team-approval.response';
import { HeadhuntingAdminGetListApprovalResponse } from './response/headhunting-admin-get-list-approval.response';
import { HeadhuntingAdminGetListRecommendationResponse } from './response/headhunting-admin-get-list-recommendation.response';
import { HeadhuntingAdminGetListRequestResponse } from './response/headhunting-admin-get-list-request.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('admin/headhunting')
export class HeadhuntingAdminController {
    constructor(private readonly headhuntingAdminService: HeadhuntingAdminService) {}

    @Get()
    async getList(
        @Query() query: HeadhuntingAdminGetListRequestRequest,
    ): Promise<BaseResponse<HeadhuntingAdminGetListRequestResponse>> {
        const code = await this.headhuntingAdminService.getList(query);
        return BaseResponse.of(code);
    }

    @Get('approval')
    async getListApproved(
        @Query() query: HeadhuntingAdminGetListApprovalRequest,
    ): Promise<BaseResponse<HeadhuntingAdminGetListApprovalResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getListApproved(query));
    }

    @Get(':id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<HeadhuntingAdminGetDetailRequestResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getDetail(id));
    }

    @Get(':id/approval/member')
    async getDetailIndividual(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<HeadhuntingGetDetailApprovalIndividualResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getDetailIndividual(id));
    }

    @Get(':id/approval/team')
    async getDetailTeam(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<HeadhuntingGetDetailApprovalTeamResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getDetailTeam(id));
    }

    @Put(':id/approve')
    async approveRequest(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.headhuntingAdminService.approveRequest(id));
    }

    @Put(':id/deny')
    async denyRequest(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: HeadhuntingAdminDenyRequestRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.headhuntingAdminService.denyRequest(id, body));
    }

    @Get('/member/recommendation')
    async getListMemberRecommendation(
        @Query() query: HeadhuntingAdminGetListMemberRecommendationRequest,
    ): Promise<BaseResponse<HeadhuntingAdminGetListRecommendationResponse>> {
        const code = await this.headhuntingAdminService.getListMemberRecommendation(query);
        return BaseResponse.of(code);
    }

    @Post('/member/recommendation')
    async addListMemberRecommendation(@Body() body: HeadhuntingAdminAddMemberRecommendationRequest): Promise<BaseResponse<void>> {
        const code = await this.headhuntingAdminService.addListMemberRecommendation(body);
        return BaseResponse.of(code);
    }

    @Get('/team/recommendation')
    async getListTeamRecommendation(
        @Query() query: HeadhuntingAdminGetListTeamRecommendationRequest,
    ): Promise<BaseResponse<HeadhuntingAdminGetListRecommendationResponse>> {
        const code = await this.headhuntingAdminService.getListTeamRecommendation(query);
        return BaseResponse.of(code);
    }

    @Post('/team/recommendation')
    async addListTeamRecommendation(@Body() body: HeadhuntingAdminAddTeamRecommendationRequest): Promise<BaseResponse<void>> {
        const code = await this.headhuntingAdminService.addListTeamRecommendation(body);
        return BaseResponse.of(code);
    }
}
