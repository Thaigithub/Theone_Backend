import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { EvaluationType } from './dto/evaluation-admin.dto';
import { EvaluationAdminService } from './evaluation-admin.service';
import { MemberEvaluationAdminGetListRequest } from './request/member-evaluation-admin-get-list.request';
import { SiteEvaluationAdminGetListRequest } from './request/site-evaluation-admin-get-list.request';
import { TeamEvaluationAdminGetListRequest } from './request/team-evaluation-admin-get-list.request';
import { MemberEvaluationAdminGetDetailResponse } from './response/member-evaluation-admin-get-detail.response';
import { MemberEvaluationAdminGetListResponse } from './response/member-evaluation-admin-get-list.response';
import { SiteEvaluationAdminGetDetailResponse } from './response/site-evaluation-admin-get-detail.response';
import { SiteEvaluationAdminGetListResponse } from './response/site-evaluation-admin-get-list.response';
import { TeamEvaluationAdminGetDetailResponse } from './response/team-evaluation-admin-get-detail.response';
import { TeamEvaluationAdminGetListResponse } from './response/team-evaluation-admin-get-list.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@ApiBearerAuth()
@ApiTags('[ADMIN] Evaluation Management')
@Controller('admin/evaluation')
export class EvaluationAdminController {
    constructor(private readonly evaluationAdminService: EvaluationAdminService) {}

    @Get('sites')
    @ApiOperation({
        summary: 'Get list of site evaluation',
        description: 'Admin can retrieve evaluation of all sites',
    })
    async getListSiteEvaluation(
        @Query() query: SiteEvaluationAdminGetListRequest,
    ): Promise<BaseResponse<SiteEvaluationAdminGetListResponse>> {
        const list = await this.evaluationAdminService.getListSiteEvaluation(query);
        const total = await this.evaluationAdminService.getTotal(EvaluationType.SITE, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('sites/:id')
    @ApiOperation({
        summary: 'Get site evaluation detail',
        description: 'Admin can retrieve detail of a site evaluation',
    })
    @ApiResponse({
        type: SiteEvaluationAdminGetDetailResponse,
        description: 'Get site evaluation successfully',
        status: HttpStatus.OK,
    })
    @ApiResponse({
        description: 'Evaluation does not exist',
        status: HttpStatus.NOT_FOUND,
    })
    async getSiteEvaluationDetail(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<SiteEvaluationAdminGetDetailResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getSiteEvaluationDetail(param));
    }

    @Get('teams')
    @ApiOperation({
        summary: 'Get list of team evaluation',
        description: 'Admin can retrieve evaluation of all teams',
    })
    async getListTeamEvaluation(
        @Query() query: TeamEvaluationAdminGetListRequest,
    ): Promise<BaseResponse<TeamEvaluationAdminGetListResponse>> {
        const list = await this.evaluationAdminService.getListTeamEvaluation(query);
        const total = await this.evaluationAdminService.getTotal(EvaluationType.TEAM, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('teams/:id')
    @ApiOperation({
        summary: 'Get team evaluation detail',
        description: 'Admin can retrieve detail of a team evaluation',
    })
    @ApiResponse({
        type: TeamEvaluationAdminGetDetailResponse,
        description: 'Get team evaluation successfully',
        status: HttpStatus.OK,
    })
    @ApiResponse({
        description: 'Evaluation does not exist',
        status: HttpStatus.NOT_FOUND,
    })
    async getTeamEvaluationDetail(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<TeamEvaluationAdminGetDetailResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getTeamEvaluationDetail(param));
    }

    @Get('members')
    @ApiOperation({
        summary: 'Get list of member evaluation',
        description: 'Admin can retrieve evaluation of all members',
    })
    async getListMemberEvaluation(
        @Query() query: MemberEvaluationAdminGetListRequest,
    ): Promise<BaseResponse<MemberEvaluationAdminGetListResponse>> {
        const list = await this.evaluationAdminService.getListMemberEvaluation(query);
        const total = await this.evaluationAdminService.getTotal(EvaluationType.MEMBER, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('members/:id')
    @ApiOperation({
        summary: 'Get member evaluation detail',
        description: 'Admin can retrieve detail of a member evaluation',
    })
    @ApiResponse({
        type: MemberEvaluationAdminGetDetailResponse,
        description: 'Get member evaluation successfully',
        status: HttpStatus.OK,
    })
    @ApiResponse({
        description: 'Evaluation does not exist',
        status: HttpStatus.NOT_FOUND,
    })
    async getMemberEvaluationDetail(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<MemberEvaluationAdminGetDetailResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getMemberEvaluationDetail(param));
    }
}
