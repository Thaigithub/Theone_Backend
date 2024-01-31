import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { EvaluationAdminService } from './evaluation-admin.service';
import { EvaluationAdminGetListMemberRequest } from './request/evaluation-admin-get-list-member.request';
import { EvaluationAdminGetListSiteRequest } from './request/evaluation-admin-get-list-site.request';
import { EvaluationAdminGetListTeamRequest } from './request/evaluation-admin-get-list-team.request';
import { EvaluationAdminGetDetailMemberResponse } from './response/evaluation-admin-get-detail-member.response';
import { EvaluationAdminGetDetailSiteResponse } from './response/evaluation-admin-get-detail-site.response';
import { EvaluationAdminGetDetailTeamResponse } from './response/evaluation-admin-get-detail-team.response';
import { EvaluationAdminGetListMemberResponse } from './response/evaluation-admin-get-list-member.response';
import { EvaluationAdminGetListSiteResponse } from './response/evaluation-admin-get-list-site.response';
import { EvaluationAdminGetListTeamResponse } from './response/evaluation-admin-get-list-team.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('/admin/evaluations')
export class EvaluationAdminController {
    constructor(private evaluationAdminService: EvaluationAdminService) {}

    @Get('/site')
    async getListSite(
        @Query() query: EvaluationAdminGetListSiteRequest,
    ): Promise<BaseResponse<EvaluationAdminGetListSiteResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getListSite(query));
    }

    @Get('/site/:id')
    async getDetailSite(@Param('id', ParseIntPipe) param: number): Promise<BaseResponse<EvaluationAdminGetDetailSiteResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getDetailSite(param));
    }

    @Get('/team')
    async getListTeam(
        @Query() query: EvaluationAdminGetListTeamRequest,
    ): Promise<BaseResponse<EvaluationAdminGetListTeamResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getListTeam(query));
    }

    @Get('/team/:id')
    async getDetailTeam(@Param('id', ParseIntPipe) param: number): Promise<BaseResponse<EvaluationAdminGetDetailTeamResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getDetailTeam(param));
    }

    @Get('/member')
    async getListMember(
        @Query() query: EvaluationAdminGetListMemberRequest,
    ): Promise<BaseResponse<EvaluationAdminGetListMemberResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getListMember(query));
    }

    @Get('/member/:id')
    async getDetailMember(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<EvaluationAdminGetDetailMemberResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getDetailMember(param));
    }
}
