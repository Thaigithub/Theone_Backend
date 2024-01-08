import { ApiProperty } from '@nestjs/swagger';
import { Member, Site, Team, TeamEvaluationByCompany } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class TeamEvaluationByCompanyResponse {
    @ApiProperty({ type: 'number' })
    id: TeamEvaluationByCompany['id'];

    @ApiProperty({ type: 'string' })
    teamName: Team['name'];

    @ApiProperty({ type: 'string' })
    leaderName: Member['name'];

    @ApiProperty({ type: 'string' })
    leaderContact: Member['contact'];

    @ApiProperty({ type: 'string' })
    siteName: Site['name'];

    @ApiProperty({
        type: 'number',
        description: "If score value is null, it means company didn't evaluate that team yet",
    })
    score: TeamEvaluationByCompany['score'];
}

export class EvaluationCompanyGetListTeamsResponse extends PaginationResponse<TeamEvaluationByCompanyResponse> {}
