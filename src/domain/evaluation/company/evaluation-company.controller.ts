import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Error } from 'utils/error.enum';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { EvaluationCompanyGetListStatus } from './enum/evaluation-company-get-list-request.enum';
import { EvaluationCompanyService } from './evaluation-company.service';
import { EvaluationCompanyCreateEvaluationRequest } from './request/evaluation-company-create-evaluation.request';
import { EvaluationCompanyGetListRequest } from './request/evaluation-company-get-list.request';
import { EvaluationCompanyGetListMemberResponse } from './response/evaluation-company-get-list-members.response';
import { EvaluationCompanyGetListTeamResponse } from './response/evaluation-company-get-list-teams.response';

@Controller('/company/evaluations')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class EvaluationCompanyController {
    constructor(private evaluationCompanyService: EvaluationCompanyService) {}

    @Patch('/member/:id/score')
    async updateMemberScore(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: EvaluationCompanyCreateEvaluationRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.evaluationCompanyService.updateMemberScore(request.user.accountId, id, body));
    }

    @Patch('/team/:id/score')
    async updateTeamScore(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: EvaluationCompanyCreateEvaluationRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.evaluationCompanyService.updateTeamScore(request.user.accountId, id, body));
    }

    @Get('/member')
    async getListMember(
        @Req() request: BaseRequest,
        @Query() query: EvaluationCompanyGetListRequest,
    ): Promise<BaseResponse<EvaluationCompanyGetListMemberResponse>> {
        if (query.score && query.status === EvaluationCompanyGetListStatus.INCOMPLETE)
            throw new BadRequestException(Error.EVALUATION_STATUS_IS_NOT_APPROPRIATE);
        return BaseResponse.of(await this.evaluationCompanyService.getListMember(request.user.accountId, query));
    }

    @Get('/team')
    async getListTeam(
        @Req() request: BaseRequest,
        @Query() query: EvaluationCompanyGetListRequest,
    ): Promise<BaseResponse<EvaluationCompanyGetListTeamResponse>> {
        if (query.score && query.status === EvaluationCompanyGetListStatus.INCOMPLETE)
            throw new BadRequestException(Error.EVALUATION_STATUS_IS_NOT_APPROPRIATE);
        return BaseResponse.of(await this.evaluationCompanyService.getListTeam(request.user.accountId, query));
    }
}
