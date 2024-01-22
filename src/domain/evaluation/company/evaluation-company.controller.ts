import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { EvaluationStatus } from './enum/evaluation-company-get-list-request.enum';
import { EvaluationCompanyService } from './evaluation-company.service';
import { EvaluationCompanyCreateEvaluationRequest } from './request/evaluation-company-create-evaluation.request';
import { EvaluationCompanyGetListRequest } from './request/evaluation-company-get-list.request';
import { EvaluationCompanyGetListMembersResponse } from './response/evaluation-company-get-list-members.response';
import { EvaluationCompanyGetListTeamsResponse } from './response/evaluation-company-get-list-teams.response';

@Controller('/company/evaluations')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class EvaluationCompanyController {
    constructor(private readonly evaluationCompanyService: EvaluationCompanyService) {}

    @Patch('/member/:id')
    async evaluateMember(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: EvaluationCompanyCreateEvaluationRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.evaluationCompanyService.evaluateMember(request.user.accountId, id, body));
    }

    @Patch('/team/:id')
    async evaluateTeam(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: EvaluationCompanyCreateEvaluationRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.evaluationCompanyService.evaluateTeam(request.user.accountId, id, body));
    }

    @Get('/member')
    async getMemberEvaluations(
        @Req() request: BaseRequest,
        @Query() query: EvaluationCompanyGetListRequest,
    ): Promise<BaseResponse<EvaluationCompanyGetListMembersResponse>> {
        if (query.score && query.status === EvaluationStatus.INCOMPLETE)
            throw new BadRequestException("Evaluation status INCOMPLETE can't be requested along with score");
        const list = await this.evaluationCompanyService.getListMembers(request.user.accountId, query);
        const total = await this.evaluationCompanyService.getTotalMembers(request.user.accountId, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('/team')
    async getTeamEvaluations(
        @Req() request: BaseRequest,
        @Query() query: EvaluationCompanyGetListRequest,
    ): Promise<BaseResponse<EvaluationCompanyGetListTeamsResponse>> {
        if (query.score && query.status === EvaluationStatus.INCOMPLETE)
            throw new BadRequestException("Evaluation status INCOMPLETE can't be requested along with score");
        const list = await this.evaluationCompanyService.getListTeams(request.user.accountId, query);
        const total = await this.evaluationCompanyService.getTotalTeams(request.user.accountId, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }
}
