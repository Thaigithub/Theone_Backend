import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { EvaluationStatus } from './dto/evaluation-member-get-list.enum';
import { EvaluationMemberService } from './evaluation-member.service';
import { EvaluationMemberCreateEvaluationRequest } from './request/evaluation-member-create-evaluation.request';
import { EvaluationMemberGetListRequest } from './request/evaluation-member-get-list.request';
import { EvaluationMemberGetListResponse } from './response/evaluation-member-get-list.response';

@ApiTags('[MEMBER] Evaluation Management')
@Controller('/member/site-evaluations')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
@Controller()
export class EvaluationMemberController {
    constructor(private readonly evaluationMemberService: EvaluationMemberService) {}

    @Patch(':id')
    @ApiOperation({
        summary: 'Evaluate site',
        description: 'Member can evaluate site',
    })
    @ApiResponse({
        type: BaseResponse,
        status: HttpStatus.OK,
    })
    @ApiResponse({
        type: BaseResponse,
        status: HttpStatus.NOT_FOUND,
    })
    async evaluateSite(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: EvaluationMemberCreateEvaluationRequest,
    ): Promise<BaseResponse<null>> {
        await this.evaluationMemberService.evaluateSite(request.user.accountId, id, body);
        return BaseResponse.ok();
    }

    @Get()
    @ApiOperation({
        summary: 'Get list of evaluation tickets for sites',
        description: 'Member can retrieve all evaluation tickets for site, including incomplete & complete evaluation',
    })
    @ApiResponse({
        type: BaseResponse,
        status: HttpStatus.NOT_FOUND,
    })
    async getMemberEvaluations(
        @Req() request: AccountIdExtensionRequest,
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
