import { ApiProperty } from '@nestjs/swagger';
import { Member, MemberEvaluationByCompany, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class MemberEvaluationByCompanyResponse {
    @ApiProperty({ type: 'number' })
    public id: MemberEvaluationByCompany['id'];

    @ApiProperty({ type: 'string' })
    public memberName: Member['name'];

    @ApiProperty({ type: 'string' })
    public contact: Member['contact'];

    @ApiProperty({ type: 'string' })
    public siteName: Site['name'];

    @ApiProperty({
        type: 'number',
        description: "If score value is null, it means company didn't evaluate that member yet",
    })
    public score: MemberEvaluationByCompany['score'];
}

export class EvaluationCompanyGetListMembersResponse extends PaginationResponse<MemberEvaluationByCompanyResponse> {}
