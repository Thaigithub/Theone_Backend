import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
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
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { MemberCreateTeamRequest, MemberUpdateExposureStatusTeamRequest } from './request/member-upsert-team.request';
import { TeamMemberApplyPost } from './request/team-member-apply-post.request';
import { TeamGetMemberRequest } from './request/team-member-get-member.request';
import { GetInvitationsResponse } from './response/team-member-get-invitation-list.response';
import {
    GetTeamMemberDetail,
    GetTeamsResponse,
    TeamMemberDetailResponse,
    TeamsResponse,
} from './response/team-member-get.response';
import { MemberTeamService } from './team-member.service';

@ApiTags('[Member] Team Management')
@Controller('member/teams')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberTeamController {
    constructor(@Inject(MemberTeamService) private readonly memberTeamService: MemberTeamService) {}

    @Post('/save')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @HttpCode(200)
    @ApiOperation({
        summary: 'Create new team',
        description: 'This endpoint allow user to create new team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Create team successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Create team details failed' })
    async save(@Request() req, @Body() request: MemberCreateTeamRequest): Promise<BaseResponse<void>> {
        await this.memberTeamService.saveTeam(req.user.accountId, request);
        return BaseResponse.ok();
    }

    @Get()
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Get list of teams',
        description: 'This endpoint list of teams of a member',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Result of teams, the example is detail of a team',
        type: GetTeamsResponse,
    })
    @ApiResponse({ description: 'Result of each team', type: TeamsResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search failed' })
    async getListOfTeams(@Req() req, @Query() query: PaginationRequest): Promise<BaseResponse<GetTeamsResponse>> {
        return BaseResponse.of(await this.memberTeamService.getTeams(req.user.accountId, query));
    }

    @Get('/invitations')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Get invitations',
        description: 'This endpoint get all invitations about member',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Result of teams', type: GetInvitationsResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search failed' })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    async getInvitationList(
        @Req() request: any,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<GetInvitationsResponse>> {
        const invitationList = await this.memberTeamService.getInvitations(request.user.accountId, query);
        return BaseResponse.of(invitationList);
    }

    @Get('/search-member')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Get member',
        description: 'This endpoint get all information about team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Result of teams', type: GetTeamMemberDetail })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search failed' })
    async getMember(@Query() query: TeamGetMemberRequest): Promise<BaseResponse<GetTeamMemberDetail>> {
        return BaseResponse.of(await this.memberTeamService.searchMember(query));
    }

    @Post('/apply-post')
    @ApiOperation({
        summary: 'Apply a post',
        description: "This endpoint add a post to request's team apply list in the system.",
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async addApplyPost(@Req() request: any, @Body() payload: TeamMemberApplyPost): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memberTeamService.addApplyPost(request.user.accountId, payload));
    }

    @Patch('/invitations/:teamId/accept')
    @ApiOperation({
        summary: 'Accept the invitation',
        description: 'Member can accept the invitation to join the team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'accepted successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'accept failed' })
    async acceptInvitation(@Req() request: any, @Param('teamId', ParseIntPipe) teamId: number): Promise<BaseResponse<void>> {
        await this.memberTeamService.acceptInvitation(request.user.accountId, teamId);
        return BaseResponse.ok();
    }

    @Patch('/invitations/:teamId/decline')
    @ApiOperation({
        summary: 'Decline the invitation',
        description: 'Member can decline the invitation to join the team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'declined successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'decline failed' })
    async declineInvitation(@Req() req: any, @Param('teamId', ParseIntPipe) teamId: number): Promise<BaseResponse<void>> {
        await this.memberTeamService.declineInvitaion(req.user.accountId, teamId);
        return BaseResponse.ok();
    }

    @Get('/:id')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Get team details',
        description: 'This endpoint get all information about team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Result of teams', type: TeamMemberDetailResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search failed' })
    async getTeamDetails(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<TeamMemberDetailResponse>> {
        return BaseResponse.of(await this.memberTeamService.getTeamDetails(id));
    }

    @Patch('/:teamId/update')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Update team',
        description: 'This endpoint update team information',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'update successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'update failed' })
    async updateTeam(
        @Req() req,
        @Param('teamId', ParseIntPipe) teamId: number,
        @Body() request: MemberCreateTeamRequest,
    ): Promise<BaseResponse<void>> {
        await this.memberTeamService.update(req.user.accountId, teamId, request);
        return BaseResponse.ok();
    }

    @Patch('/:id/exposure')
    @ApiOperation({
        summary: 'Change exposure status of a team',
        description: 'Leader member can change the exposure status of a team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'update successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'update failed' })
    async changeHiddenStatus(
        @Req() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: MemberUpdateExposureStatusTeamRequest,
    ): Promise<BaseResponse<void>> {
        await this.memberTeamService.changeExposureStatus(req.user.accountId, id, payload);
        return BaseResponse.ok();
    }

    @Delete('/:id/delete')
    @ApiOperation({
        summary: 'Delete a team',
        description: 'Leader can delete the the team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'declined successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'decline failed' })
    async deleteTeam(@Req() req: any, @Param('teamId', ParseIntPipe) teamId: number): Promise<BaseResponse<void>> {
        await this.memberTeamService.deleteTeam(req.user.accountId, teamId);
        return BaseResponse.ok();
    }

    @Put('/:teamId/:memberId/invite')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Invite a member to the team',
        description: 'This endpoint get all information about team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Invited member successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Invite member failed' })
    async inviteMember(
        @Request() req,
        @Param('teamId', ParseIntPipe) teamId: number,
        @Param('memberId', ParseIntPipe) memberId: number,
    ): Promise<BaseResponse<void>> {
        await this.memberTeamService.inviteMember(req.user.accountId, teamId, memberId);
        return BaseResponse.ok();
    }

    @Patch('/:teamId/:memberId/cancelInvite')
    @ApiOperation({
        summary: 'cancel the invitation',
        description: 'Member can cancel the invitation sent to memberId',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'declined successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'decline failed' })
    async cancelInvitation(
        @Req() req: any,
        @Param('teamId', ParseIntPipe) teamId: number,
        @Param('memberId', ParseIntPipe) memberId: number,
    ): Promise<BaseResponse<void>> {
        await this.memberTeamService.cancelInvitation(req.user.accountId, teamId, memberId);
        return BaseResponse.ok();
    }
}
