import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { CountResponse } from 'utils/generics/count.response';
import { MemberAdminService } from './member-admin.service';
import { MemberAdminGetCountRequest } from './request/member-admin-count.request';
import { MemberAdminGetListRecommendationRequest } from './request/member-admin-get-list-recommendation.request';
import { MemberAdminGetPoinDetailtListRequest } from './request/member-admin-get-point-detail-list.request';
import { MemberAdminGetPointListRequest } from './request/member-admin-get-point-list.request';
import {
    ChangeMemberRequest,
    DownloadMembersRequest,
    DownloadSingleMemberRequest,
    GetMembersListRequest,
} from './request/member-admin.request';
import { MemberAdminGetDetailResponse } from './response/member-admin-get-detail.response';
import { MemberAdminGetListRecommendationResponse } from './response/member-admin-get-list-recommendation.response';
import { MemberAdminGetListResponse } from './response/member-admin-get-list.response';
import { MemberAdminGetPointDetailListResponse } from './response/member-admin-get-point-detail-list.response';
import { MemberAdminGetPointDetailResponse } from './response/member-admin-get-point-detail.response';
import { MemberAdminGetPointListResponse } from './response/member-admin-get-point-list.response';

@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Controller('/admin/members')
export class MemberAdminController {
    constructor(private memberAdminService: MemberAdminService) {}

    @Get()
    async getList(@Query() query: GetMembersListRequest): Promise<BaseResponse<MemberAdminGetListResponse>> {
        return BaseResponse.of(await this.memberAdminService.getList(query));
    }

    @Get('/count')
    async getCount(@Query() query: MemberAdminGetCountRequest): Promise<BaseResponse<CountResponse>> {
        return BaseResponse.of(await this.memberAdminService.getCount(query));
    }

    @Get('/download')
    async download(
        @Query() query: DownloadSingleMemberRequest | DownloadMembersRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        let memberIds = [];
        if (Array.isArray(query.memberId)) {
            memberIds = query.memberId.map((item) => parseInt(item));
        } else if (typeof query.memberId === 'string') memberIds = [parseInt(query.memberId)];
        return BaseResponse.of(await this.memberAdminService.download(memberIds, response));
    }

    @Get('/headhunting')
    async getListHeadhunting(
        @Query() query: MemberAdminGetListRecommendationRequest,
    ): Promise<BaseResponse<MemberAdminGetListRecommendationResponse>> {
        return BaseResponse.of(await this.memberAdminService.getListHeadhunting(query));
    }

    @Get('/point')
    async getPointList(@Query() query: MemberAdminGetPointListRequest): Promise<BaseResponse<MemberAdminGetPointListResponse>> {
        return BaseResponse.of(await this.memberAdminService.getPointList(query));
    }

    @Get('/:id/point/general')
    async getPointDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<MemberAdminGetPointDetailResponse>> {
        return BaseResponse.of(await this.memberAdminService.getPointDetail(id));
    }

    @Get('/:id/point')
    async getPointDetailList(
        @Param('id', ParseIntPipe) id: number,
        @Query() query: MemberAdminGetPoinDetailtListRequest,
    ): Promise<BaseResponse<MemberAdminGetPointDetailListResponse>> {
        return BaseResponse.of(await this.memberAdminService.getPointDetailList(id, query));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<MemberAdminGetDetailResponse>> {
        return BaseResponse.of(await this.memberAdminService.getDetail(id));
    }

    @Patch('/:id')
    async changeMemberInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ChangeMemberRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memberAdminService.updateMember(id, body));
    }
}
