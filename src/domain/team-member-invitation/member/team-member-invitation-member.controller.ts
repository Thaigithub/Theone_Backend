import { Controller, Get, Inject, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { GetTeamMemberInvitationGetListResponse } from './response/team-member-invitation-member-get-list.response';
import { MemberTeamMemberInvitationService } from './team-member-invitation-member.service';

@Controller('member/invitations')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class MemberTeamMemberInvitationController {
    constructor(
        @Inject(MemberTeamMemberInvitationService)
        private readonly memberTeamMemberInvitationService: MemberTeamMemberInvitationService,
    ) {}

    @Get()
    async getInvitationList(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<GetTeamMemberInvitationGetListResponse>> {
        const invitationList = await this.memberTeamMemberInvitationService.getInvitations(request.user.accountId, query);
        return BaseResponse.of(invitationList);
    }

    @Patch('/:id/accept')
    async acceptInvitation(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        await this.memberTeamMemberInvitationService.accept(request.user.accountId, id);
        return BaseResponse.ok();
    }

    @Patch(':id/decline')
    async declineInvitation(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        await this.memberTeamMemberInvitationService.decline(req.user.accountId, id);
        return BaseResponse.ok();
    }
}
