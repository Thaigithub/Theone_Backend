import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { EvaluationMemberStatus } from './dto/evaluation-member-get-list.enum';
import { EvaluationMemberService } from './evaluation-member.service';
import { EvaluationMemberCreateSiteRequest } from './request/evaluation-member-create-site.request';
import { EvaluationMemberGetListSiteRequest } from './request/evaluation-member-get-list-site.request';
import { EvaluationMemberGetListSiteResponse } from './response/evaluation-member-get-list-site.response';

@Controller('/member/evaluations/site')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class EvaluationMemberController {
    constructor(private evaluationMemberService: EvaluationMemberService) {}

    @Patch('/:id/score')
    async updateSiteScore(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: EvaluationMemberCreateSiteRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.evaluationMemberService.updateSiteScore(request.user.accountId, id, body));
    }

    @Get('/completed/count')
    async getTotalCompleted(@Req() request: BaseRequest): Promise<BaseResponse<number>> {
        return BaseResponse.of(await this.evaluationMemberService.getTotalCompleted(request.user.accountId));
    }

    @Get()
    async getListSite(
        @Req() request: BaseRequest,
        @Query() query: EvaluationMemberGetListSiteRequest,
    ): Promise<BaseResponse<EvaluationMemberGetListSiteResponse>> {
        if (query.score && query.status === EvaluationMemberStatus.INCOMPLETE)
            throw new BadRequestException("Evaluation status INCOMPLETE can't be requested along with score");
        return BaseResponse.of(await this.evaluationMemberService.getListSite(request.user.accountId, query));
    }
}
