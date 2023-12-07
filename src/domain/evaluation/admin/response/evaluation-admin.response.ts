import { ApiProperty } from '@nestjs/swagger';
import { Company, Site, SiteEvaluation } from '@prisma/client';

class SiteEvaluationResponse {
    @ApiProperty({ type: 'string' })
    id: SiteEvaluation['id'];

    @ApiProperty({ type: 'string' })
    companyName: Company['name'];

    @ApiProperty({ type: 'string' })
    siteName: Site['name'];

    @ApiProperty({ type: 'number' })
    totalEvaluator: SiteEvaluation['totalEvaluator'];

    @ApiProperty({ type: 'float' })
    averageScore: SiteEvaluation['averageScore'];
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

export { SiteEvaluationResponse, GetListSiteEvaluationResponse };
