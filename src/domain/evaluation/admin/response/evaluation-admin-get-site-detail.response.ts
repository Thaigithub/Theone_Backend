import { ApiProperty } from '@nestjs/swagger';
import { Account, Company, Member, Site, SiteEvaluation, SiteEvaluationByMember } from '@prisma/client';

class ListOfSiteEvaluators {
    @ApiProperty({ type: 'string' })
    name: Member['name'];

    @ApiProperty({ type: 'string' })
    username: Account['username'];

    @ApiProperty({ type: 'string' })
    contact: Member['contact'];

    @ApiProperty({ type: 'number' })
    score: SiteEvaluationByMember['score'];
}

export class AdminGetSiteEvaluationDetailResponse {
    @ApiProperty({ type: 'string' })
    companyName: Company['name'];

    @ApiProperty({ type: 'string' })
    siteName: Site['name'];

    @ApiProperty({ type: 'string' })
    address: Site['address'];

    @ApiProperty({ type: 'string' })
    contact: Site['contact'];

    @ApiProperty({ type: 'string' })
    personInCharge: Site['personInCharge'];

    @ApiProperty({ type: 'number' })
    totalEvaluators: SiteEvaluation['totalEvaluators'];

    @ApiProperty({ type: 'number' })
    averageScore: SiteEvaluation['averageScore'];

    @ApiProperty({ type: () => [ListOfSiteEvaluators] })
    listOfEvaluators: ListOfSiteEvaluators[];
}
