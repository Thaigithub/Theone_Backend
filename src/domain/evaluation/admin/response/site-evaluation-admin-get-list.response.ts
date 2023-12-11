import { ApiProperty } from '@nestjs/swagger';
import { Company, Site, SiteEvaluation } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class SiteEvaluationResponse {
    @ApiProperty({ type: 'number' })
    id: SiteEvaluation['id'];

    @ApiProperty({ type: 'string' })
    companyName: Company['name'];

    @ApiProperty({ type: 'string' })
    siteName: Site['name'];

    @ApiProperty({ type: 'number' })
    totalEvaluators: SiteEvaluation['totalEvaluators'];

    @ApiProperty({ type: 'number' })
    averageScore: SiteEvaluation['averageScore'];
}

export class SiteEvaluationAdminGetListResponse extends PaginationResponse<SiteEvaluationResponse> {}
