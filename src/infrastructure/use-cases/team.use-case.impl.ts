import { Inject, Injectable } from '@nestjs/common';
import { TeamDTO } from 'application/dtos/team.dto';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { PaginationValidationService } from 'common/utils/pagination-validator';
import { TeamRepository } from 'domain/repositories/team.repository';
import { ExcelService } from 'infrastructure/services/excel.service';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { GetAdminTeamResponse, GetTeamDetailsResponse } from 'presentation/responses/admin-team.response';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';
import { Response } from 'express';

@Injectable()
export class TeamUseCaseImpl implements TeamUseCase {
  constructor(
    @Inject(TeamRepository) private readonly teamRepository: TeamRepository,
    @Inject(ExcelService) private readonly excelService: ExcelService,
  ) {}
  async download(teamIds: number[], response: Response): Promise<void> {
    const teams = await this.teamRepository.getTeamWithIds(teamIds);
    const excelData: Omit<GetAdminTeamResponse, 'id' | 'isActive'>[] = teams.map(({ id, isActive, ...rest }) => rest);
    const excelStream = await this.excelService.createExcelFile(excelData, 'Teams');
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
    excelStream.pipe(response);
  }
  async getTeamDetail(id: number): Promise<GetTeamDetailsResponse> {
    const result = await this.teamRepository.getTeamDetail(id);
    return result;
  }
  async searchTeams(request: TeamSearchRequest): Promise<PaginationResponse<TeamDTO>> {
    const teams = await this.teamRepository.searchTeamFilter(request);
    const teamsDto = teams.map(team => {
      const teamSize = team.members.length;
      const leaderName = team.leader.name;
      const leaderContact = team.leader.contact;
      return TeamDTO.from(team, leaderName, leaderContact, teamSize);
    });
    PaginationValidationService.validate(teamsDto, request.pageNumber, request.pageSize);
    const startIndex = (request.pageNumber - 1) * request.pageSize;
    const endIndex = startIndex + request.pageSize;
    const paginatedItems = teamsDto.slice(startIndex, endIndex);
    return {
      data: paginatedItems,
      pageInfo: { total: teams.length },
    };
  }
}
