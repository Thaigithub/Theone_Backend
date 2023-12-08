import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    ParseIntPipe,
    Query,
    Res,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAdminTeamResponse, GetTeamDetailsResponse } from 'domain/team/admin/response/admin-team.response';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { AdminTeamService } from './admin-team.service';
import { DownloadTeamsRequest, TeamSearchRequest } from './request/team.request';
@ApiTags('[Admin] Team Management')
@Controller('admin/teams')
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
    async searchTeamFilter(@Query() query: TeamSearchRequest): Promise<BaseResponse<PaginationResponse<GetAdminTeamResponse>>> {
        return BaseResponse.of(await this.teamService.searchTeamFilter(query));
    }

    @Get('download')
    @ApiProduces('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    @ApiConsumes('application/json')
    @ApiOperation({
        summary: 'Download teams in excel file',
        description: 'Admin can retrieve an excel file contains information of selected teams',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'download teams excel file successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'download teams excel file failed' })
    async download(@Query() query: DownloadTeamsRequest, @Res() response: Response): Promise<BaseResponse<void>> {
        const parsedTeamIds: number[] = query.teamIds
            .slice(1, -1)
            .split(',')
            .map((id) => parseInt(id.trim(), 10));
        if (parsedTeamIds.some(isNaN)) {
            throw new BadRequestException('Invalid teamIds provided');
        }
        await this.teamService.download(parsedTeamIds, response);
        return BaseResponse.ok();
    }

    @Get('download-team-details')
    @ApiProduces('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    @ApiConsumes('application/json')
    @ApiOperation({
        summary: 'Download team Details in excel file',
        description: 'Admin can retrieve an excel file contains information of team Details',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'download team details excel file successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'download team details excel file failed' })
    async downloadTeamDetails(
        @Query('teamId', ParseIntPipe) teamId: number,
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        await this.teamService.downloadTeamDetails(teamId, response);
        return BaseResponse.ok();
    }

    @Get(':id')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Get team details',
        description: 'This endpoint get team details',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Details of team' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Get team details failed' })
    async getCertificateDetails(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<GetTeamDetailsResponse>> {
        const result = await this.teamService.getTeamDetail(id);
        return BaseResponse.of(result);
    }
}
