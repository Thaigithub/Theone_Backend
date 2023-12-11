import { ApiProperty } from '@nestjs/swagger';
import { Company, Member, Site, TeamEvaluation, TeamEvaluationByCompany } from '@prisma/client';

class ListOfEvaluators {
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

export class MemberEvaluationAdminGetDetailResponse {
    @ApiProperty({ type: 'string' })
    name: Member['name'];

    @ApiProperty({ type: 'string' })
    contact: Member['contact'];

    @ApiProperty({ type: 'number' })
    totalEvaluators: TeamEvaluation['totalEvaluators'];

    @ApiProperty({ type: 'number' })
    averageScore: TeamEvaluation['averageScore'];

    @ApiProperty({ type: () => [ListOfEvaluators] })
    listOfEvaluators: ListOfEvaluators[];
}
