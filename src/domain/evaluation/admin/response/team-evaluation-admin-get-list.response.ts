import { ApiProperty } from '@nestjs/swagger';
import { Member, Team, TeamEvaluation } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class TeamEvaluationResponse {
    @ApiProperty({ type: 'number' })
    id: TeamEvaluation['id'];

    @ApiProperty({ type: 'string' })
    teamName: Team['name'];

    @ApiProperty({ type: 'string' })
    leaderName: Member['name'];

    @ApiProperty({ type: 'number' })
    totalMembers: Team['totalMembers'];

    @ApiProperty({ type: 'number' })
    totalEvaluators: TeamEvaluation['totalEvaluators'];

    @ApiProperty({ type: 'number' })
    averageScore: TeamEvaluation['averageScore'];
}

export class TeamEvaluationAdminGetListResponse extends PaginationResponse<TeamEvaluationResponse> {}
