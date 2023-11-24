import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamDTO } from 'application/dtos/team.dto';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { BaseResponse } from 'presentation/responses/base.response';

@ApiTags('AdminTeamManagementController')
@Controller('admin/teams')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AdminTeamManagementController {
  constructor(@Inject(TeamUseCase) private readonly teamUseCase: TeamUseCase) {}
  

  @Post()
  @ApiOperation({
    summary: 'Create account',
    description: 'This endpoint creates a account in the system',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Verify OTP successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Verify OTP failed' })
  async searchTeamFilter(@Body() request:TeamSearchRequest ): Promise<any> {
    return request;
  }
}
