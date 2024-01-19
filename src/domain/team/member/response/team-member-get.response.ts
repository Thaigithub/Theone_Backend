import { InvitationStatus, Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class MemberResponse {
    id: number;
    name: string;
    contact: string;
}

export class TeamsResponse {
    name: Team['name'];
    code: {
        id: number;
        codeName: string;
        code: string;
    };
    isActive: Team['isActive'];
    isLeader: boolean;
    leaderName: string;
    status: Team['status'];
    exposureStatus: Team['exposureStatus'];
    createdAt: Team['createdAt'];
    numberOfRecruitments: Team['numberOfRecruitments'];
    totalMembers: number;
    memberInfors: MemberResponse[];
}
export class GetTeamsResponse extends PaginationResponse<TeamsResponse> {}

export class GetTeamDetail {
    name: string;
    city: {
        id: number;
        englishName: string;
        koreanName: string;
    };
    district: {
        id: number;
        englishName: string;
        koreanName: string;
    };
    introduction: string;
    createdAt: Date;
    code: {
        id: number;
        codeName: string;
        code: string;
    };
    leaderName: string;
    leaderContact: string;
}

export class GetTeamMemberDetail {
    id: number;
    name: string;
    contact: string;
}

export class GetTeamMemberInvitation {
    id: number;
    memberId: number;
    name: string;
    contact: string;
    invitationStatus: InvitationStatus;
}
export class TeamMemberDetailResponse {
    team: GetTeamDetail;
    members: GetTeamMemberDetail[];
    memberInvitations: GetTeamMemberInvitation[];
}
