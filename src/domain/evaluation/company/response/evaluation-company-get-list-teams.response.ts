import { ApiProperty } from '@nestjs/swagger';
import { Member, Site, Team, TeamEvaluationByCompany } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class TeamEvaluationByCompanyResponse {
    @ApiProperty({ type: 'number' })
    public id: TeamEvaluationByCompany['id'];

    @ApiProperty({ type: 'string' })
    public teamName: Team['name'];

    @ApiProperty({ type: 'string' })
    public leaderName: Member['name'];

    @ApiProperty({ type: 'string' })
    public leaderContact: Member['contact'];

    @ApiProperty({ type: 'string' })
    public siteName: Site['name'];

    @ApiProperty({
        type: 'number',
        description: "If score value is null, it means company didn't evaluate that team yet",
    })
    public score: TeamEvaluationByCompany['score'];
}

export class EvaluationCompanyGetListTeamsResponse extends PaginationResponse<TeamEvaluationByCompanyResponse> {}
