import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamDTO } from 'application/dtos/team.dto';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { BaseResponse } from 'presentation/responses/base.response';
import { Pagination } from 'presentation/responses/pageInfo.response';

@ApiTags('AdminTeamManagementController')
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
  async searchTeamFilter(@Body() request: TeamSearchRequest): Promise<BaseResponse<Pagination<TeamDTO>>> {
    return BaseResponse.of(await this.teamUseCase.searchTeams(request));
  }
}
