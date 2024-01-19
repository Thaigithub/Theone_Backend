import { Controller, Get, Inject, Param, ParseIntPipe, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { GetAdminTeamResponse, GetTeamDetailsResponse } from 'domain/team/admin/response/admin-team.response';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { AdminTeamDownloadListRequest, AdminTeamDownloadRequest } from './request/team-admin-download.request';
import { AdminTeamGetListRequest } from './request/team-admin-get-list.request';
import { AdminTeamService } from './team-admin.service';
@Controller('admin/teams')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class AdminTeamController {
    constructor(@Inject(AdminTeamService) private readonly teamService: AdminTeamService) {}

    @Get()
    async searchTeamFilter(
        @Query() query: AdminTeamGetListRequest,
    ): Promise<BaseResponse<PaginationResponse<GetAdminTeamResponse>>> {
        return BaseResponse.of(await this.teamService.searchTeamFilter(query));
    }

    @Get('download')
    async download(
        @Query('teamIds') query: AdminTeamDownloadListRequest | AdminTeamDownloadRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamService.download(query, response));
    }

    @Get('download-team-details')
    async downloadTeamDetails(
        @Query('teamId', ParseIntPipe) teamId: number,
        @Query('memberIds') memberIds: string | string[],
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamService.downloadTeamDetails(teamId, response, memberIds));
    }

    @Get(':id')
    async getTeamDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<GetTeamDetailsResponse>> {
        const result = await this.teamService.getTeamDetail(id);
        return BaseResponse.of(result);
    }
}
