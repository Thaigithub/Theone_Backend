import { ApiProperty } from '@nestjs/swagger';
import { Account, Company, Member, Site, SiteEvaluation, SiteEvaluationByMember } from '@prisma/client';

class SiteEvaluationResponse {
    @ApiProperty({ type: 'string' })
    id: SiteEvaluation['id'];

    @ApiProperty({ type: 'string' })
    companyName: Company['name'];

    @ApiProperty({ type: 'string' })
    siteName: Site['name'];

    @ApiProperty({ type: 'number' })
    totalEvaluator: SiteEvaluation['totalEvaluator'];

    @ApiProperty({ type: 'number' })
    averageScore: SiteEvaluation['averageScore'];
}

class ListOfEvaluators {
    @ApiProperty({ type: 'string' })
    name: Member['name'];

    @ApiProperty({ type: 'string' })
    username: Account['username'];

    @ApiProperty({ type: 'string' })
    contact: Member['contact'];

    @ApiProperty({ type: 'number' })
    score: SiteEvaluationByMember['score'];
}

class GetListSiteEvaluationResponse {
    @ApiProperty({ type: () => [SiteEvaluationResponse] })
    list: SiteEvaluationResponse[];

    @ApiProperty({
        type: 'number',
        examples: [0, 1, 2],
    })
    total: number;

    constructor(list: SiteEvaluationResponse[], total: number) {
        this.list = list;
        this.total = total;
    }
}

class GetSiteEvaluationDetailResponse {
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
    totalEvaluators: SiteEvaluation['totalEvaluator'];

    @ApiProperty({ type: 'number' })
    averageScore: SiteEvaluation['averageScore'];

    @ApiProperty({ type: () => [ListOfEvaluators] })
    listOfEvaluators: ListOfEvaluators[];
}

export { SiteEvaluationResponse, GetListSiteEvaluationResponse, GetSiteEvaluationDetailResponse };
