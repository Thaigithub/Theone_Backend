import { Inject, Injectable } from '@nestjs/common';
import { TeamDTO } from 'domain/team/dto/team.dto';
import { TeamSearchRequest } from 'domain/team/request/team.request';
import { GetAdminTeamResponse, GetTeamDetailsResponse, GetTeamMemberDetails } from 'domain/team/response/admin-team.response';
import { TeamRepository } from 'domain/team/team.repository';
import { TeamUseCase } from 'domain/team/team.use-case';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { PaginationValidationService } from 'utils/pagination-validator';

@Injectable()
export class TeamUseCaseImpl implements TeamUseCase {
    constructor(
        @Inject(TeamRepository) private readonly teamRepository: TeamRepository,
        @Inject(ExcelService) private readonly excelService: ExcelService,
    ) {}
    async downloadTeamDetails(teamId: number, response: Response): Promise<void> {
        const teamDetails = await this.teamRepository.getTeamDetail(teamId);
        const excelData: Omit<GetTeamMemberDetails, 'id'>[] = teamDetails.members.map(({ id, ...rest }) => rest);
        const excelStream = await this.excelService.createExcelFile(excelData, 'Teams');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }
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
        const teamsDto = teams.map((team) => {
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
