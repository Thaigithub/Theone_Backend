import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
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
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { MemberCreateTeamRequest, MemberUpdateExposureStatusTeamRequest } from './request/member-upsert-team.request';
import { TeamMemberGetInviteRequest } from './request/team-member-get-invite.request';
import { TeamGetMemberRequest } from './request/team-member-get-member.request';
import { GetTeamMemberDetail, GetTeamsResponse, TeamMemberDetailResponse } from './response/team-member-get.response';
import { MemberTeamService } from './team-member.service';

@Controller('member/teams')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class MemberTeamController {
    constructor(@Inject(MemberTeamService) private readonly memberTeamService: MemberTeamService) {}

    @Post('/save')
    async save(@Request() req, @Body() request: MemberCreateTeamRequest): Promise<BaseResponse<void>> {
        await this.memberTeamService.saveTeam(req.user.accountId, request);
        return BaseResponse.ok();
    }

    @Get()
    async getListOfTeams(@Req() req, @Query() query: PaginationRequest): Promise<BaseResponse<GetTeamsResponse>> {
        return BaseResponse.of(await this.memberTeamService.getTeams(req.user.accountId, query));
    }

    @Get('/search-member')
    async getMember(@Query() query: TeamGetMemberRequest): Promise<BaseResponse<GetTeamMemberDetail>> {
        return BaseResponse.of(await this.memberTeamService.searchMember(query));
    }

    @Put('/:id/invitations/invite')
    async inviteMember(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: TeamMemberGetInviteRequest,
    ): Promise<BaseResponse<void>> {
        await this.memberTeamService.inviteMember(req.user.accountId, id, payload.id);
        return BaseResponse.ok();
    }

    @Patch('/:id/invitations/:inviteId/cancel')
    async cancelInvitation(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
        @Param('inviteId', ParseIntPipe) inviteId: number,
    ): Promise<BaseResponse<void>> {
        await this.memberTeamService.cancelInvitation(req.user.accountId, id, inviteId);
        return BaseResponse.ok();
    }

    @Get('/:id')
    async getTeamDetails(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<TeamMemberDetailResponse>> {
        return BaseResponse.of(await this.memberTeamService.getTeamDetails(req.user.accountId, id));
    }

    @Put('/:id/update')
    async updateTeam(
        @Req() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() request: MemberCreateTeamRequest,
    ): Promise<BaseResponse<void>> {
        await this.memberTeamService.update(req.user.accountId, id, request);
        return BaseResponse.ok();
    }

    @Patch('/:id/exposure')
    async changeHiddenStatus(
        @Req() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: MemberUpdateExposureStatusTeamRequest,
    ): Promise<BaseResponse<void>> {
        await this.memberTeamService.changeExposureStatus(req.user.accountId, id, payload);
        return BaseResponse.ok();
    }

    @Delete('/:id/delete')
    async deleteTeam(@Req() req: AccountIdExtensionRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        await this.memberTeamService.deleteTeam(req.user.accountId, id);
        return BaseResponse.ok();
    }
}
