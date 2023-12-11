import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { EvaluationAdminService } from './evaluation-admin.service';
import { AdminGetListMemberEvaluationRequest } from './request/evaluation-admin-get-list-member.request';
import { AdminGetListSiteEvaluationRequest } from './request/evaluation-admin-get-list-site.request';
import { AdminGetListTeamEvaluationRequest } from './request/evaluation-admin-get-list-team.request';
import { AdminGetListSiteEvaluationResponse } from './response/evaluation-admin-get-list-site.response';
import { AdminGetListTeamEvaluationResponse } from './response/evaluation-admin-get-list-team.response';
import { AdminGetListMemberEvaluationResponse } from './response/evaluation-admin-get-list-member.response';
import { AdminGetSiteEvaluationDetailResponse } from './response/evaluation-admin-get-site-detail.response';
import { AdminGetTeamEvaluationDetailResponse } from './response/evaluation-admin-get-team-detail.response';
import { AdminGetMemberEvaluationDetailResponse } from './response/evaluation-admin-get-member-detail.response';
import { EvaluationType } from './dto/evaluation-admin.dto';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@ApiTags('[ADMIN] Evaluation Management')
@Controller('admin/evaluation')
export class EvaluationAdminController {
    constructor(private readonly evaluationAdminService: EvaluationAdminService) {}

    @Get('sites')
    async getListSiteEvaluation(
        @Query() query: AdminGetListSiteEvaluationRequest,
    ): Promise<BaseResponse<AdminGetListSiteEvaluationResponse>> {
        const list = await this.evaluationAdminService.getListSiteEvaluation(query);
        const total = await this.evaluationAdminService.getTotal(EvaluationType.SITE, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('sites/:id')
    async getSiteEvaluationDetail(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<AdminGetSiteEvaluationDetailResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getSiteEvaluationDetail(param));
    }

    @Get('teams')
    async getListTeamEvaluation(
        @Query() query: AdminGetListTeamEvaluationRequest,
    ): Promise<BaseResponse<AdminGetListTeamEvaluationResponse>> {
        const list = await this.evaluationAdminService.getListTeamEvaluation(query);
        const total = await this.evaluationAdminService.getTotal(EvaluationType.TEAM, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('teams/:id')
    async getTeamEvaluationDetail(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<AdminGetTeamEvaluationDetailResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getTeamEvaluationDetail(param));
    }

    @Get('members')
    async getListMemberEvaluation(
        @Query() query: AdminGetListMemberEvaluationRequest,
    ): Promise<BaseResponse<AdminGetListMemberEvaluationResponse>> {
        const list = await this.evaluationAdminService.getListMemberEvaluation(query);
        const total = await this.evaluationAdminService.getTotal(EvaluationType.MEMBER, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('members/:id')
    async getMemberEvaluationDetail(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<AdminGetMemberEvaluationDetailResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getMemberEvaluationDetail(param));
    }
}
