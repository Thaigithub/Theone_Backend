import { Account, Member, Team } from '@prisma/client';
import { TeamStatusForSearch } from '../dto/team-search';
export class GetAdminTeamResponse {
    id: number;
    teamCode: string;
    name: Team['name'];
    leaderName: string;
    leaderContact: string;
    totalMembers: number;
    status: TeamStatusForSearch;
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
    teamCode: string;
}
