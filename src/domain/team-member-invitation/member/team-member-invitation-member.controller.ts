import { Controller, Get, HttpStatus, Inject, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { GetTeamMemberInvitationGetListResponse } from './response/team-member-invitation-member-get-list.response';
import { MemberTeamMemberInvitationService } from './team-member-invitation-member.service';

@ApiTags('[Member] Team-Member Invitation Management')
@Controller('member/invitations')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberTeamMemberInvitationController {
    constructor(
        @Inject(MemberTeamMemberInvitationService)
        private readonly memberTeamMemberInvitationService: MemberTeamMemberInvitationService,
    ) {}

    @Get()
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Get invitations',
        description: 'This endpoint get all invitations about member',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Result of teams', type: GetTeamMemberInvitationGetListResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Search failed' })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    async getInvitationList(
        @Req() request: any,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<GetTeamMemberInvitationGetListResponse>> {
        const invitationList = await this.memberTeamMemberInvitationService.getInvitations(request.user.accountId, query);
        return BaseResponse.of(invitationList);
    }

    @Patch('/:id/accept')
    @ApiOperation({
        summary: 'Accept the invitation',
        description: 'Member of team can accept the invitation to join the team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'accepted successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'accept failed' })
    async acceptInvitation(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        await this.memberTeamMemberInvitationService.accept(request.user.accountId, id);
        return BaseResponse.ok();
    }

    @Patch(':id/decline')
    @ApiOperation({
        summary: 'Decline the invitation',
        description: 'Member can decline the invitation to join the team',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'declined successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'decline failed' })
    async declineInvitation(@Req() req: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        await this.memberTeamMemberInvitationService.decline(req.user.accountId, id);
        return BaseResponse.ok();
    }
}
