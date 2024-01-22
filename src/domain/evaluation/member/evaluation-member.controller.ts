import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { EvaluationStatus } from './dto/evaluation-member-get-list.enum';
import { EvaluationMemberService } from './evaluation-member.service';
import { EvaluationMemberCreateEvaluationRequest } from './request/evaluation-member-create-evaluation.request';
import { EvaluationMemberGetListRequest } from './request/evaluation-member-get-list.request';
import { EvaluationMemberGetListResponse } from './response/evaluation-member-get-list.response';

@Controller('/member/site-evaluations')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class EvaluationMemberController {
    constructor(private readonly evaluationMemberService: EvaluationMemberService) {}

    @Patch(':id')
    async evaluateSite(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: EvaluationMemberCreateEvaluationRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.evaluationMemberService.evaluateSite(request.user.accountId, id, body));
    }

    @Get('count-completed')
    async getTotalCompletedEvaluation(@Req() request: BaseRequest): Promise<BaseResponse<number>> {
        return BaseResponse.of(await this.evaluationMemberService.getTotalCompletedEvaluation(request.user.accountId));
    }

    @Get()
    async getMemberEvaluations(
        @Req() request: BaseRequest,
        @Query() query: EvaluationMemberGetListRequest,
    ): Promise<BaseResponse<EvaluationMemberGetListResponse>> {
        if (query.score && query.status === EvaluationStatus.INCOMPLETE)
            throw new BadRequestException("Evaluation status INCOMPLETE can't be requested along with score");
        const list = await this.evaluationMemberService.getListSites(request.user.accountId, query);
        const total = await this.evaluationMemberService.getTotalSites(request.user.accountId, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }
}
