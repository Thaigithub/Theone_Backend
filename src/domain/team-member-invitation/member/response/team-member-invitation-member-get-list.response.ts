import { InvitationStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class TeamMemberInvitationResponse {
    teamId: number;
    memberId: number;
    teamName: string;
    leaderName: string;
    contact: string;
    invitationDate: Date;
    introduction: string;
    invitationStatus: InvitationStatus;
}

export class GetTeamMemberInvitationGetListResponse extends PaginationResponse<TeamMemberInvitationResponse> {}
