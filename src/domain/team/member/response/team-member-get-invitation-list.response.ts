import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class InvitationsResponse {
    @ApiProperty({ type: Number, example: 1 })
    teamId: number;

    @ApiProperty({ type: Number, example: 1 })
    memberId: number;

    @ApiProperty({ type: 'string', example: ' team name' })
    teamName: string;

    @ApiProperty({ type: 'string', example: ' team leader name' })
    leaderName: string;

    @ApiProperty({ type: 'string', example: '000-00000-0000' })
    contact: string;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    invitationDate: Date;

    @ApiProperty({ type: 'string', example: 'This is introduction' })
    introduction: string;

    @ApiProperty({ type: 'enum', enum: InvitationStatus, example: InvitationStatus.ACCEPTED })
    invitationStatus: InvitationStatus;
}

export class GetInvitationsResponse extends PaginationResponse<InvitationsResponse> {}
