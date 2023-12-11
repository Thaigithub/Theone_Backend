import { ApiProperty } from '@nestjs/swagger';
import { Member, MemberEvaluation } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class MemberEvaluationResponse {
    @ApiProperty({ type: 'number' })
    id: MemberEvaluation['id'];

    @ApiProperty({ type: 'string' })
    name: Member['name'];

    @ApiProperty({ type: 'string' })
    contact: Member['name'];

    @ApiProperty({ type: 'number' })
    totalEvaluators: MemberEvaluation['totalEvaluators'];

    @ApiProperty({ type: 'number' })
    averageScore: MemberEvaluation['averageScore'];
}

export class MemberEvaluationAdminGetListResponse extends PaginationResponse<MemberEvaluationResponse> {}
