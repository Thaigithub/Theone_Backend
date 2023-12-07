import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { GetListSiteEvaluationRequest } from './request/evaluation-admin.request';
import { EvaluationAdminService } from './evaluation-admin.service';
import { BaseResponse } from 'utils/generics/base.response';
import { GetListSiteEvaluationResponse, GetSiteEvaluationDetailResponse } from './response/evaluation-admin.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@ApiTags('[ADMIN] Evaluation Management')
@Controller('admin/evaluation')
export class EvaluationAdminController {
    constructor(private readonly evaluationAdminService: EvaluationAdminService) {}

    @Get('sites')
    async getListSiteEvaluation(
        @Query() query: GetListSiteEvaluationRequest,
    ): Promise<BaseResponse<GetListSiteEvaluationResponse>> {
        const list = await this.evaluationAdminService.getListSiteEvaluation(query);
        const total = await this.evaluationAdminService.getTotalSiteEvaluation(query);
        return BaseResponse.of(new GetListSiteEvaluationResponse(list, total));
    }

    @Get('sites/:id')
    async getSiteEvaluationDetail(
        @Param('id', ParseIntPipe) param: number,
    ): Promise<BaseResponse<GetSiteEvaluationDetailResponse>> {
        return BaseResponse.of(await this.evaluationAdminService.getSiteEvaluationDetail(param));
    }
}
