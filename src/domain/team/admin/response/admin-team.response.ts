import { ApiProperty } from '@nestjs/swagger';
import { Account, Member, Team, TeamStatus } from '@prisma/client';
import { TeamStatusForSearch } from '../dto/team-search';
export class GetAdminTeamResponse {
    @ApiProperty({ type: Number, example: 1 })
    id: number;

    @ApiProperty({
        type: 'string',
        example: 'The teamCode is different from code (which means the occupation code)',
    })
    teamCode: string;

    @ApiProperty({ type: 'string', example: ' name' })
    name: Team['name'];

    @ApiProperty({ type: 'string', example: 'leader name' })
    leaderName: string;

    @ApiProperty({ type: 'string', example: 'leader contact' })
    leaderContact: string;

    @ApiProperty({ type: Number, example: 1 })
    totalMembers: number;

    @ApiProperty({ type: 'enum', enum: TeamStatusForSearch, example: TeamStatus.GENERAL })
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

    @ApiProperty({ type: 'string', example: ' team name' })
    teamName: Team['name'];

    @ApiProperty({ type: 'string', example: ' code name' })
    teamCode: string;
}
