import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { TeamCompanyGetListRequest } from './request/team-company-get-list.request';
import { TeamCompanyGetDetailResponse } from './response/team-company-get-detail.response';
import { TeamCompanyGetListResponse } from './response/team-company-get-list.response';
import { TeamCompanyService } from './team-company.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@Controller('/company/teams')
export class TeamCompanyController {
    constructor(private teamCompanyService: TeamCompanyService) {}

    @Get('/:id')
    async getTeamDetailManpower(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<TeamCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.teamCompanyService.getDetail(req.user.accountId, id));
    }

    @Get()
    async getListTeams(
        @Req() req: BaseRequest,
        @Query() query: TeamCompanyGetListRequest,
        @Query('occupation', new ParseArrayPipe({ optional: true })) occupation: [string] | undefined,
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<TeamCompanyGetListResponse>> {
        return BaseResponse.of(
            await this.teamCompanyService.getList(req.user.accountId, { ...query, experienceTypeList, occupation, regionList }),
        );
    }
}
