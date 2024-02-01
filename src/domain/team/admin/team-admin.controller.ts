import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { TeamAdminGetListRecommendationRequest } from './request/team-admin-get-list-recommendation.request';
import { TeamAdminGetListRequest } from './request/team-admin-get-list.request';
import { TeamAdminGetDetailResponse } from './response/team-admin-get-detail.response';
import { TeamAdminGetListRecommendationResponse } from './response/team-admin-get-list-recommendation.response';
import { TeamAdminGetListResponse } from './response/team-admin-get-list.response';
import { TeamAdminService } from './team-admin.service';
@Controller('/admin/teams')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class TeamAdminController {
    constructor(private teamAdminService: TeamAdminService) {}

    @Get('/:id/download')
    async downloadDetail(
        @Param('id', ParseIntPipe) teamId: number,
        @Query('memberIds') memberIds: string | string[],
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamAdminService.downloadDetail(teamId, response, memberIds));
    }

    @Get('/headhunting')
    async getListHeadhunting(
        @Query() query: TeamAdminGetListRecommendationRequest,
    ): Promise<BaseResponse<TeamAdminGetListRecommendationResponse>> {
        return BaseResponse.of(await this.teamAdminService.getListHeadhunting(query));
    }

    @Get('/download')
    async download(
        @Query('teamIds', ParseArrayPipe) query: string[] | string,
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamAdminService.download(query, response));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<TeamAdminGetDetailResponse>> {
        return BaseResponse.of(await this.teamAdminService.getDetail(id));
    }

    @Get()
    async getList(@Query() query: TeamAdminGetListRequest): Promise<BaseResponse<TeamAdminGetListResponse>> {
        return BaseResponse.of(await this.teamAdminService.getList(query));
    }
}
