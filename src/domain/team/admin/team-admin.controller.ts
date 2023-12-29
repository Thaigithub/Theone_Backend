import { Controller, Get, HttpStatus, Inject, Param, ParseIntPipe, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
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
@ApiTags('[Admin] Team Management')
@Controller('admin/teams')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AdminTeamController {
    constructor(@Inject(AdminTeamService) private readonly teamService: AdminTeamService) {}

    @Get()
    @ApiOperation({
        summary: 'Search teams with filter and pagination',
        description: 'This endpoint list of teams with given filter',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Result of teams returned' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search failed' })
    async searchTeamFilter(
        @Query() query: AdminTeamGetListRequest,
    ): Promise<BaseResponse<PaginationResponse<GetAdminTeamResponse>>> {
        return BaseResponse.of(await this.teamService.searchTeamFilter(query));
    }

    @Get('download')
    @ApiOperation({
        summary: 'Download teams in excel file',
        description: 'Admin can retrieve an excel file contains information of selected teams',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'download teams excel file successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'download teams excel file failed' })
    async download(
        @Query('teamIds') query: AdminTeamDownloadListRequest | AdminTeamDownloadRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamService.download(query, response));
    }

    @Get('download-team-details')
    @ApiOperation({
        summary: 'Download team Details in excel file',
        description: 'Admin can retrieve an excel file contains information of team Details',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'download team details excel file successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'download team details excel file failed' })
    async downloadTeamDetails(
        @Query('teamId', ParseIntPipe) teamId: number,
        @Query('memberIds') memberIds: string | string[],
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamService.downloadTeamDetails(teamId, response, memberIds));
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get team details',
        description: 'This endpoint get team details',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Details of team' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Get team details failed' })
    async getTeamDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<GetTeamDetailsResponse>> {
        const result = await this.teamService.getTeamDetail(id);
        return BaseResponse.of(result);
    }
}
