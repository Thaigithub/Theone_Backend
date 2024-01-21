import { InvitationStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListInvitationResponse {
    teamId: number;
    memberId: number;
    teamName: string;
    leaderName: string;
    contact: string;
    invitationDate: Date;
    introduction: string;
    invitationStatus: InvitationStatus;
}

export class TeamMemberGetListInvitationResponse extends PaginationResponse<GetListInvitationResponse> {}
