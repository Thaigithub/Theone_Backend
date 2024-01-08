import { ApiProperty } from '@nestjs/swagger';
import { Member, MemberEvaluationByCompany, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class MemberEvaluationByCompanyResponse {
    @ApiProperty({ type: 'number' })
    id: MemberEvaluationByCompany['id'];

    @ApiProperty({ type: 'string' })
    memberName: Member['name'];

    @ApiProperty({ type: 'string' })
    contact: Member['contact'];

    @ApiProperty({ type: 'string' })
    siteName: Site['name'];

    @ApiProperty({
        type: 'number',
        description: "If score value is null, it means company didn't evaluate that member yet",
    })
    score: MemberEvaluationByCompany['score'];
}

export class EvaluationCompanyGetListMembersResponse extends PaginationResponse<MemberEvaluationByCompanyResponse> {}
