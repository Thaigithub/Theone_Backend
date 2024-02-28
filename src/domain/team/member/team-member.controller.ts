import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    Req,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { TeamMemberCreateInvitationRequest } from './request/team-member-get-invite.request';
import { TeamMemberGetListRequest } from './request/team-member-get-list.request';
import { TeamMemberUpdateExposureRequest } from './request/team-member-update-exposure.request';
import { TeamMemberUpdateInvitationStatus } from './request/team-member-update-invitation-status.request';
import { TeamMemberUpsertRequest } from './request/team-member-upsert.request';
import { TeamMemberGetDetailResponse } from './response/team-member-get-detail.response';
import { TeamMemberGetListInvitationResponse } from './response/team-member-get-list-invitation.response';
import { TeamMemberGetListResponse } from './response/team-member-get-list.response';
import { TeamMemberService } from './team-member.service';

@Controller('/member/teams')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class TeamMemberController {
    constructor(private teamMemberService: TeamMemberService) {}

    @Patch('/invitation/:id/status')
    async updateInvitationStatus(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: TeamMemberUpdateInvitationStatus,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamMemberService.updateInvitationStatus(request.user.accountId, id, body));
    }

    @Delete('/:id/invitation/:inviteId')
    async deleteInvitation(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Param('inviteId', ParseIntPipe) inviteId: number,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamMemberService.deleteInvitation(req.user.accountId, id, inviteId));
    }

    @Patch('/:id/exposure')
    async updateExposure(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: TeamMemberUpdateExposureRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamMemberService.updateExposure(req.user.accountId, id, payload));
    }

    @Post('/:id/invitation')
    async createInvitation(
        @Request() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: TeamMemberCreateInvitationRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamMemberService.createInvitation(req.user.accountId, id, body));
    }

    @Get('/invitation')
    async getListInvitation(
        @Req() request: BaseRequest,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<TeamMemberGetListInvitationResponse>> {
        return BaseResponse.of(await this.teamMemberService.getListInvitation(request.user.accountId, query));
    }

    @Delete('/:id')
    async delete(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamMemberService.delete(req.user.accountId, id));
    }

    @Get('/:id')
    async getDetail(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<TeamMemberGetDetailResponse>> {
        return BaseResponse.of(await this.teamMemberService.getDetail(req.user.accountId, id));
    }

    @Put('/:id')
    async update(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() request: TeamMemberUpsertRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamMemberService.update(req.user.accountId, id, request));
    }

    @Post()
    async create(@Request() req: BaseRequest, @Body() request: TeamMemberUpsertRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.teamMemberService.create(req.user.accountId, request));
    }

    @Get()
    async getList(
        @Req() req: BaseRequest,
        @Query() query: TeamMemberGetListRequest,
    ): Promise<BaseResponse<TeamMemberGetListResponse>> {
        return BaseResponse.of(await this.teamMemberService.getList(req.user.accountId, query));
    }
}
