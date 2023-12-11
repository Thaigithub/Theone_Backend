import { ApiProperty } from '@nestjs/swagger';
import { Member, Team, TeamEvaluation } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class MemberEvaluationResponse {
    @ApiProperty({ type: 'number' })
    id: TeamEvaluation['id'];

    @ApiProperty({ type: 'string' })
    name: Team['name'];

    @ApiProperty({ type: 'string' })
    contact: Member['name'];

    @ApiProperty({ type: 'number' })
    totalEvaluators: TeamEvaluation['totalEvaluators'];

    @ApiProperty({ type: 'number' })
    averageScore: TeamEvaluation['averageScore'];
}

export class AdminGetListMemberEvaluationResponse extends PaginationResponse<MemberEvaluationResponse> {}
