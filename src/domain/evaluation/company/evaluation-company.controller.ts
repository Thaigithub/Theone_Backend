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
import { EvaluationStatus } from './dto/evaluation-company-get-list-request.enum';
import { EvaluationCompanyService } from './evaluation-company.service';
import { EvaluationCompanyCreateEvaluationRequest } from './request/evaluation-company-create-evaluation.request';
import { EvaluationCompanyGetListMembersRequest } from './request/evaluation-company-get-list-members.request';
import { EvaluationCompanyGetListTeamsRequest } from './request/evaluation-company-get-list-teams.request';
import { EvaluationCompanyGetListMembersResponse } from './response/evaluation-company-get-list-members.response';
import { EvaluationCompanyGetListTeamsResponse } from './response/evaluation-company-get-list-teams.response';

@ApiTags('[COMPANY] Evaluation Management')
@Controller('/company/evaluations')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class EvaluationCompanyController {
    constructor(private readonly evaluationCompanyService: EvaluationCompanyService) {}

    @Patch('member-evaluations/:id')
    @ApiOperation({
        summary: 'Evaluate member',
        description: 'Company can evaluate member',
    })
    @ApiResponse({
        type: BaseResponse,
        status: HttpStatus.OK,
    })
    @ApiResponse({
        type: BaseResponse,
        status: HttpStatus.NOT_FOUND,
    })
    async evaluateMember(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: EvaluationCompanyCreateEvaluationRequest,
    ): Promise<BaseResponse<void>> {
        await this.evaluationCompanyService.evaluateMember(request.user.accountId, id, body);
        return BaseResponse.ok();
    }

    @Patch('team-evaluations/:id')
    @ApiOperation({
        summary: 'Evaluate team',
        description: 'Company can evaluate team',
    })
    @ApiResponse({
        type: BaseResponse,
        status: HttpStatus.OK,
    })
    @ApiResponse({
        type: BaseResponse,
        status: HttpStatus.NOT_FOUND,
    })
    async evaluateTeam(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: EvaluationCompanyCreateEvaluationRequest,
    ): Promise<BaseResponse<void>> {
        await this.evaluationCompanyService.evaluateTeam(request.user.accountId, id, body);
        return BaseResponse.ok();
    }

    @Get('member-evaluations')
    @ApiOperation({
        summary: 'Get list of evaluation tickets for member',
        description: 'Company can retrieve all evaluation tickets for member, including incomplete & complete evaluation',
    })
    @ApiResponse({
        type: BaseResponse,
        status: HttpStatus.NOT_FOUND,
    })
    async getMemberEvaluations(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: EvaluationCompanyGetListMembersRequest,
    ): Promise<BaseResponse<EvaluationCompanyGetListMembersResponse>> {
        if (query.score && query.status === EvaluationStatus.INCOMPLETE)
            throw new BadRequestException("Evaluation status INCOMPLETE can't be requested along with score");
        const list = await this.evaluationCompanyService.getListMembers(request.user.accountId, query);
        const total = await this.evaluationCompanyService.getTotalMembers(request.user.accountId, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get('team-evaluations')
    @ApiOperation({
        summary: 'Get list of evaluation tickets for team',
        description: 'Company can retrieve all evaluation tickets for team, including incomplete & complete evaluation',
    })
    @ApiResponse({
        type: BaseResponse,
        status: HttpStatus.NOT_FOUND,
    })
    async getTeamEvaluations(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: EvaluationCompanyGetListTeamsRequest,
    ): Promise<BaseResponse<EvaluationCompanyGetListTeamsResponse>> {
        if (query.score && query.status === EvaluationStatus.INCOMPLETE)
            throw new BadRequestException("Evaluation status INCOMPLETE can't be requested along with score");
        const list = await this.evaluationCompanyService.getListTeams(request.user.accountId, query);
        const total = await this.evaluationCompanyService.getTotalTeams(request.user.accountId, query);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }
}
