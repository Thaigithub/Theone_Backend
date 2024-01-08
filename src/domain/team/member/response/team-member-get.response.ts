import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus, Team, TeamStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class TeamsResponse {
    // @ApiProperty({ type: Number, example: 1 })
    // id: Team['id'];

    @ApiProperty({ type: 'string', example: 'name' })
    name: Team['name'];

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

    @ApiProperty({ type: Boolean, example: true })
    isActive: Team['isActive'];

    @ApiProperty({ type: Boolean, example: true })
    isLeader: boolean;

    @ApiProperty({ type: 'string', example: 'leader name' })
    leaderName: string;

    @ApiProperty({ type: 'enum', enum: TeamStatus, example: TeamStatus.GENERAL })
    status: Team['status'];

    @ApiProperty({ type: Boolean, example: true })
    exposureStatus: Team['exposureStatus'];

    @ApiProperty({ type: Date, example: 'YYYY-MM-DDThh:mm:ssZ' })
    createdAt: Team['createdAt'];

    @ApiProperty({ type: Number, example: 1 })
    numberOfRecruitments: Team['numberOfRecruitments'];

    @ApiProperty({ type: Number, example: 1 })
    totalMembers: number;
}
export class GetTeamsResponse extends PaginationResponse<TeamsResponse> {}

export class GetTeamDetail {
    @ApiProperty({ type: 'string', example: ' team name' })
    name: string;

    @ApiProperty({
        type: 'object',
        example: {
            id: 1,
            englishName: 'Seoul',
            koreanName: '근무지원내역',
        },
    })
    city: {
        id: number;
        englishName: string;
        koreanName: string;
    };

    @ApiProperty({
        type: 'object',
        example: {
            id: 1,
            englishName: 'Seoul',
            koreanName: '근무지원내역',
        },
    })
    district: {
        id: number;
        englishName: string;
        koreanName: string;
    };

    @ApiProperty({ type: 'string', example: ' introduction' })
    introduction: string;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    createdAt: Date;

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

    @ApiProperty({ type: 'string', example: 'leader Name' })
    leaderName: string;

    @ApiProperty({ type: 'string', example: 'leader contact' })
    leaderContact: string;
}

export class GetTeamMemberDetail {
    @ApiProperty({ type: Number, example: 'member id' })
    id: number;

    @ApiProperty({ type: 'string', example: 'member Name' })
    name: string;

    @ApiProperty({ type: 'string', example: 'contact' })
    contact: string;
}

export class GetTeamMemberInvitation {
    @ApiProperty({ type: Number, example: 'invited member id' })
    id: number;

    @ApiProperty({ type: Number, example: 'invited member id' })
    memberId: number;

    @ApiProperty({ type: 'string', example: 'invited member name' })
    name: string;

    @ApiProperty({ type: 'string', example: 'contact' })
    contact: string;

    @ApiProperty({ type: 'enum', enum: InvitationStatus, example: InvitationStatus.ACCEPTED })
    invitationStatus: InvitationStatus;
}
export class TeamMemberDetailResponse {
    @ApiProperty({ type: GetTeamDetail })
    team: GetTeamDetail;

    @ApiProperty({ type: [GetTeamMemberDetail] })
    members: GetTeamMemberDetail[];

    @ApiProperty({ type: [GetTeamMemberInvitation] })
    memberInvitations: GetTeamMemberInvitation[];
}
