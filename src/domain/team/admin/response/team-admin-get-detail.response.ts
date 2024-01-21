import { Account, Member, Team } from '@prisma/client';

export class TeamAdminGetDetailResponse {
    members: {
        id: Member['id'];
        name: Member['name'];
        userName: string;
        contact: Member['contact'];
        level: Member['level'];
        memberStatus: Account['status'];
    }[];
    teamName: Team['name'];
    teamCode: string;
}
