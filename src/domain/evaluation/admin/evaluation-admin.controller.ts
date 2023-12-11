import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { EvaluationType } from './dto/evaluation-admin.dto';
import { EvaluationAdminService } from './evaluation-admin.service';
import { SiteEvaluationAdminGetListRequest } from './request/site-evaluation-admin-get-list.request';
import { SiteEvaluationAdminGetListResponse } from './response/site-evaluation-admin-get-list.response';
import { TeamEvaluationAdminGetListRequest } from './request/team-evaluation-admin-get-list.request';
import { SiteEvaluationAdminGetDetailResponse } from './response/site-evaluation-admin-get-detail.response';
import { TeamEvaluationAdminGetListResponse } from './response/team-evaluation-admin-get-list.response';
import { TeamEvaluationAdminGetDetailResponse } from './response/team-evaluation-admin-get-detail.response';
import { MemberEvaluationAdminGetListRequest } from './request/member-evaluation-admin-get-list.request';
import { MemberEvaluationAdminGetListResponse } from './response/member-evaluation-admin-get-list.response';
import { MemberEvaluationAdminGetDetailResponse } from './response/member-evaluation-admin-get-detail.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@ApiTags('[ADMIN] Evaluation Management')
@Controller('admin/evaluation')
export class EvaluationAdminController {
    constructor(private readonly evaluationAdminService: EvaluationAdminService) {}

    @Get('sites')
    async getListSiteEvaluation(
        @Query() query: SiteEvaluationAdminGetListRequest,
    ): Promise<BaseResponse<SiteEvaluationAdminGetListResponse>> {
        const list = await this.evaluationAdminService.getListSiteEvaluation(query);
        const total = await this.evaluationAdminService.getTotal(EvaluationType.SITE, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('sites/:id')
    async getSiteEvaluationDetail(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<SiteEvaluationAdminGetDetailResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getSiteEvaluationDetail(param));
    }

    @Get('teams')
    async getListTeamEvaluation(
        @Query() query: TeamEvaluationAdminGetListRequest,
    ): Promise<BaseResponse<TeamEvaluationAdminGetListResponse>> {
        const list = await this.evaluationAdminService.getListTeamEvaluation(query);
        const total = await this.evaluationAdminService.getTotal(EvaluationType.TEAM, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('teams/:id')
    async getTeamEvaluationDetail(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<TeamEvaluationAdminGetDetailResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getTeamEvaluationDetail(param));
    }

    @Get('members')
    async getListMemberEvaluation(
        @Query() query: MemberEvaluationAdminGetListRequest,
    ): Promise<BaseResponse<MemberEvaluationAdminGetListResponse>> {
        const list = await this.evaluationAdminService.getListMemberEvaluation(query);
        const total = await this.evaluationAdminService.getTotal(EvaluationType.MEMBER, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('members/:id')
    async getMemberEvaluationDetail(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<MemberEvaluationAdminGetDetailResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getMemberEvaluationDetail(param));
    }
}
