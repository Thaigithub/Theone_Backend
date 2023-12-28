import { ApiProperty } from '@nestjs/swagger';
import { Account, Company, Member, Site, SiteEvaluation, SiteEvaluationByMember } from '@prisma/client';

export class SiteEvaluationAdminGetDetailResponse {
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

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
                username: {
                    type: 'string',
                },
                contact: {
                    type: 'string',
                },
                score: {
                    type: 'number',
                },
            },
        },
    })
    listOfEvaluators: {
        name: Member['name'];
        username: Account['username'];
        contact: Member['contact'];
        score: SiteEvaluationByMember['score'];
    }[];
}
