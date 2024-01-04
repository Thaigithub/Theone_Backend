import { Controller, Get, HttpStatus, Param, ParseArrayPipe, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { TeamCompanyGetTeamDetailApplicants } from './response/team-company-get-team-detail.response';
import { TeamCompanyManpowerGetListRequest } from './request/team-company-manpower-get-list.request';
import { TeamCompanyManpowerGetListResponse } from './response/team-company-manpower-get-list.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { TeamCompanyService } from './team-company.service';
import { TeamCompanyManpowerGetDetailResponse } from './response/team-company-manpower-get-detail.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@Controller('company/teams')
@ApiTags('[COMPANY] Team Management')
export class TeamCompanyController {
    constructor(private readonly teamCompanyService: TeamCompanyService) {}

    @Get(':id/applicants')
    @ApiOperation({
        summary: 'Post detail',
        description: 'Retrieve post information detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: TeamCompanyGetTeamDetailApplicants,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getTeamDetail(
        @Req() request: any,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<TeamCompanyGetTeamDetailApplicants>> {
        return BaseResponse.of(await this.teamCompanyService.getTeamDetail(request.user.accountId, id));
    }

    @Get(':id/manpower')
    @ApiOperation({
        summary: 'Get team detail in Manpower',
        description: 'Company can retrieve team information detail in Manpower',
    })
    @ApiResponse({ status: HttpStatus.OK, type: TeamCompanyManpowerGetDetailResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getTeamDetailManpower(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<TeamCompanyManpowerGetDetailResponse>> {
        return BaseResponse.of(await this.teamCompanyService.getTeamDetailManpower(id));
    }

    @Get('manpower')
    @ApiOperation({
        summary: 'Get list of teams in Manpower',
        description: 'Company can retrieve all teams in Manpower',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getListTeams(
        @Query() query: TeamCompanyManpowerGetListRequest,
        @Query('occupationList', new ParseArrayPipe({ optional: true })) occupationList: [string] | undefined,
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('districtList', new ParseArrayPipe({ optional: true })) districtList: [string] | undefined,
    ): Promise<BaseResponse<TeamCompanyManpowerGetListResponse>> {
        query = { ...query, experienceTypeList, occupationList, districtList };
        const list = await this.teamCompanyService.getList(query);
        const total = await this.teamCompanyService.getTotal(query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }
}
