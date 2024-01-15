import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { TeamCompanyManpowerGetListRequest } from './request/team-company-manpower-get-list.request';
import { TeamCompanyManpowerGetDetailResponse } from './response/team-company-manpower-get-detail.response';
import { TeamCompanyManpowerGetListResponse } from './response/team-company-manpower-get-list.response';
import { TeamCompanyService } from './team-company.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('company/teams')
export class TeamCompanyController {
    constructor(private readonly teamCompanyService: TeamCompanyService) {}
    @Get(':id/manpower')
    async getTeamDetailManpower(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<TeamCompanyManpowerGetDetailResponse>> {
        return BaseResponse.of(await this.teamCompanyService.getTeamDetailManpower(id));
    }

    @Get('manpower')
    async getListTeams(
        @Query() query: TeamCompanyManpowerGetListRequest,
        @Query('occupation', new ParseArrayPipe({ optional: true })) occupation: [string] | undefined,
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<TeamCompanyManpowerGetListResponse>> {
        query = { ...query, experienceTypeList, occupation, regionList };
        const list = await this.teamCompanyService.getList(query);
        const total = await this.teamCompanyService.getTotal(query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }
}
