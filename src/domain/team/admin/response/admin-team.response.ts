import { Account, Member, Team } from '@prisma/client';
export class GetAdminTeamResponse {
    id: Team['id'];
    code: Team['code'];
    name: Team['name'];
    isActive: Team['isActive'];
    status: Team['status'];
    leaderName: string;
    leaderContact: string;
    members?: number;
}

export class GetTeamMemberDetails {
    id: Member['id'];
    name: Member['name'];
    userName: string;
    contact: Member['contact'];
    level: Member['level'];
    memberStatus: Account['status'];
}
export class GetTeamDetailsResponse {
    members: GetTeamMemberDetails[];
    teamName: Team['name'];
    teamCode: Team['code'];
}
