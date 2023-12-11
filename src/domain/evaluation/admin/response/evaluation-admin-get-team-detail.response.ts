import { ApiProperty } from '@nestjs/swagger';
import { Company, Member, Site, Team, TeamEvaluation, TeamEvaluationByCompany } from '@prisma/client';

class ListOfTeamEvaluators {
    @ApiProperty({ type: 'string' })
    companyName: Company['name'];

    @ApiProperty({ type: 'string' })
    siteName: Site['name'];

    @ApiProperty({ type: 'string' })
    siteContact: Site['contact'];

    @ApiProperty({ type: 'string' })
    personInCharge: Site['personInCharge'];

    @ApiProperty({ type: 'number' })
    score: TeamEvaluationByCompany['score'];
}

export class AdminGetTeamEvaluationDetailResponse {
    @ApiProperty({ type: 'string' })
    teamName: Team['name'];

    @ApiProperty({ type: 'string' })
    leaderName: Member['name'];

    @ApiProperty({ type: 'string' })
    totalMembers: Team['totalMembers'];

    @ApiProperty({ type: 'number' })
    totalEvaluators: TeamEvaluation['totalEvaluators'];

    @ApiProperty({ type: 'number' })
    averageScore: TeamEvaluation['averageScore'];

    @ApiProperty({ type: () => [ListOfTeamEvaluators] })
    listOfEvaluators: ListOfTeamEvaluators[];
}
