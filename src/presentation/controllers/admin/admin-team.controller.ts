import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamDTO } from 'application/dtos/team.dto';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { GetTeamDetailsResponse } from 'presentation/responses/admin-team.response';
import { BaseResponse } from 'presentation/responses/base.response';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';

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
