import { ApiProperty } from '@nestjs/swagger';
import { Account, Member, Team, TeamStatus } from '@prisma/client';
export class GetAdminTeamResponse {
    id: Team['id'];
    @ApiProperty({
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            codeName: {
                type: 'string',
            },
            code: {
                type: 'string',
            },
        },
    })
    code: {
        id: number;
        codeName: string;
        code: string;
    };

    @ApiProperty({ type: 'string', example: ' name' })
    name: Team['name'];

    @ApiProperty({ type: Boolean, example: true })
    isActive: Team['isActive'];

    @ApiProperty({ type: 'enum', enum: TeamStatus, example: TeamStatus.GENERAL })
    status: Team['status'];

    @ApiProperty({ type: 'string', example: 'leader name' })
    leaderName: string;

    @ApiProperty({ type: 'string', example: 'leader contact' })
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

    @ApiProperty({ type: 'string', example: ' team name' })
    teamName: Team['name'];

    @ApiProperty({
        type: 'object',
        properties: {
            id: {
                type: 'number',
            },
            codeName: {
                type: 'string',
            },
            code: {
                type: 'string',
            },
        },
    })
    code: {
        id: number;
        codeName: string;
        code: string;
    };
}
