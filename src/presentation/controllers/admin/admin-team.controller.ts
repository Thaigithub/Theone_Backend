import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamDTO } from 'application/dtos/team.dto';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { GetTeamDetailsResponse } from 'presentation/responses/admin-team.response';
import { BaseResponse } from 'presentation/responses/base.response';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';
import { Response } from 'express';
@ApiTags('[Admin] Team Management')
@Controller('admin/teams')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AdminTeamController {
  constructor(@Inject(TeamUseCase) private readonly teamUseCase: TeamUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Search teams with filter and pagination',
    description: 'This endpoint list of teams with given filter',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Result of teams returned' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search failed' })
  async searchTeamFilter(@Body() request: TeamSearchRequest): Promise<BaseResponse<PaginationResponse<TeamDTO>>> {
    return BaseResponse.of(await this.teamUseCase.searchTeams(request));
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
  async download(@Query('teamIds') teamIds: string, @Res() response: Response): Promise<BaseResponse<void>> {
    const parsedTeamIds: number[] = teamIds
      .slice(1, -1)
      .split(',')
      .map(id => parseInt(id.trim(), 10));
    if (parsedTeamIds.some(isNaN)) {
      throw new BadRequestException('Invalid teamIds provided');
    }
    await this.teamUseCase.download(parsedTeamIds, response);
    return;
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
    const result = await this.teamUseCase.getTeamDetail(id);
    return BaseResponse.of(result);
  }
}
