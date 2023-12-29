import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator';
import { HeadhuntingAdminService } from './headhunting-admin.service';
import {
    HeadhuntingAdminAddMemberRecommendationRequest,
    HeadhuntingAdminAddTeamRecommendationRequest,
} from './request/headhunting-admin-add-recommendation.request';
import { HeadhuntingAdminDenyRequestRequest } from './request/headhunting-admin-deny-request.request';
import { HeadhuntingAdminGetListApprovalRequest } from './request/headhunting-admin-get-list-approval.request';
import {
    HeadhuntingAdminGetListMemberRecommendationRequest,
    HeadhuntingAdminGetListTeamRecommendationRequest,
} from './request/headhunting-admin-get-list-recommendation.request';
import { HeadhuntingAdminGetListRequestRequest } from './request/headhunting-admin-get-list-request.request';
import { HeadhuntingGetDetailApprovalIndividualResponse } from './response/headhunting-admin-get-detail-approval.response';
import { HeadhuntingAdminGetDetailRequestResponse } from './response/headhunting-admin-get-detail-request.response';
import { HeadhuntingGetDetailApprovalTeamResponse } from './response/headhunting-admin-get-detail-team-approval.response';
import { HeadhuntingAdminGetListApprovalResponse } from './response/headhunting-admin-get-list-approval.response';
import { HeadhuntingAdminGetListRecommendationResponse } from './response/headhunting-admin-get-list-recommendation.response';
import {
    HeadhuntingAdminGetItemRequestResponse,
    HeadhuntingAdminGetListRequestResponse,
} from './response/headhunting-admin-get-list-request.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@ApiBearerAuth()
@Controller('admin/headhunting')
@ApiTags('[ADMIN] Headhunting Management')
export class HeadhuntingAdminController {
    constructor(private readonly headhuntingAdminService: HeadhuntingAdminService) {}

    @Get()
    @ApiOperation({
        summary: 'Listing headhunting request',
        description: 'Admin can list headhunting request',
    })
    @ApiOkResponsePaginated(HeadhuntingAdminGetItemRequestResponse)
    async getList(
        @Query() query: HeadhuntingAdminGetListRequestRequest,
    ): Promise<BaseResponse<HeadhuntingAdminGetListRequestResponse>> {
        const code = await this.headhuntingAdminService.getList(query);
        return BaseResponse.of(code);
    }

    @Get('approval')
    @ApiOperation({
        summary: 'Listing headhunting request approved',
        description: 'Admin can list headhunting request approved',
    })
    async getListApproved(
        @Query() query: HeadhuntingAdminGetListApprovalRequest,
    ): Promise<BaseResponse<HeadhuntingAdminGetListApprovalResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getListApproved(query));
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Headhunting request detail',
        description: 'Admin can view headhunting request detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: HeadhuntingAdminGetDetailRequestResponse,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<HeadhuntingAdminGetDetailRequestResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getDetail(id));
    }

    @Get(':id/approval-individual')
    @ApiOperation({
        summary: 'Headhunting approval detail',
        description: 'Admin can view headhunting approval detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: HeadhuntingAdminGetDetailRequestResponse,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getDetailIndividual(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<HeadhuntingGetDetailApprovalIndividualResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getDetailIndividual(id));
    }

    @Get(':id/approval-team')
    @ApiOperation({
        summary: 'Headhunting approval detail',
        description: 'Admin can view headhunting approval detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: HeadhuntingAdminGetDetailRequestResponse,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getDetailTeam(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<HeadhuntingGetDetailApprovalTeamResponse>> {
        return BaseResponse.of(await this.headhuntingAdminService.getDetailTeam(id));
    }

    @Put(':id/approve')
    @ApiOperation({
        summary: 'Headhunting request approved',
        description: 'Admin can approve headhunting request',
    })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async approveRequest(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.headhuntingAdminService.approveRequest(id));
    }

    @Put(':id/deny')
    @ApiOperation({
        summary: 'Headhunting request deny',
        description: 'Admin can deny headhunting request',
    })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async denyRequest(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: HeadhuntingAdminDenyRequestRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.headhuntingAdminService.denyRequest(id, body));
    }

    @Get('/member/recommendation')
    @ApiOperation({
        summary: 'Listing headhunting recommendation members',
        description: 'Admin can list headhunting recommendation members',
    })
    @ApiOkResponsePaginated(HeadhuntingAdminGetItemRequestResponse)
    async getListMemberRecommendation(
        @Query() query: HeadhuntingAdminGetListMemberRecommendationRequest,
    ): Promise<BaseResponse<HeadhuntingAdminGetListRecommendationResponse>> {
        const code = await this.headhuntingAdminService.getListMemberRecommendation(query);
        return BaseResponse.of(code);
    }

    @Post('/member/recommendation')
    @ApiOperation({
        summary: 'Add a member to headhunting recommendation members',
        description: 'Admin can add a member headhunting recommendation members',
    })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async addListMemberRecommendation(@Body() body: HeadhuntingAdminAddMemberRecommendationRequest): Promise<BaseResponse<void>> {
        const code = await this.headhuntingAdminService.addListMemberRecommendation(body);
        return BaseResponse.of(code);
    }

    @Get('/team/recommendation')
    @ApiOperation({
        summary: 'Listing headhunting recommendation teams',
        description: 'Admin can list headhunting recommendation teams',
    })
    @ApiOkResponsePaginated(HeadhuntingAdminGetItemRequestResponse)
    async getListTeamRecommendation(
        @Query() query: HeadhuntingAdminGetListTeamRecommendationRequest,
    ): Promise<BaseResponse<HeadhuntingAdminGetListRecommendationResponse>> {
        const code = await this.headhuntingAdminService.getListTeamRecommendation(query);
        return BaseResponse.of(code);
    }

    @Post('/team/recommendation')
    @ApiOperation({
        summary: 'Add a team to headhunting recommendation teams',
        description: 'Admin can add a team headhunting recommendation teams',
    })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async addListTeamRecommendation(@Body() body: HeadhuntingAdminAddTeamRecommendationRequest): Promise<BaseResponse<void>> {
        const code = await this.headhuntingAdminService.addListTeamRecommendation(body);
        return BaseResponse.of(code);
    }
}
