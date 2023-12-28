import { ApiProperty } from '@nestjs/swagger';
import { Company, Member, Site, TeamEvaluation, TeamEvaluationByCompany } from '@prisma/client';

export class MemberEvaluationAdminGetDetailResponse {
    @ApiProperty({ type: 'string' })
    name: Member['name'];

    @ApiProperty({ type: 'string' })
    contact: Member['contact'];

    @ApiProperty({ type: 'number' })
    totalEvaluators: TeamEvaluation['totalEvaluators'];

    @ApiProperty({ type: 'number' })
    averageScore: TeamEvaluation['averageScore'];

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                companyName: {
                    type: 'string',
                },
                siteName: {
                    type: 'string',
                },
                contact: {
                    type: 'string',
                },
                ersonInCharge: {
                    type: 'string',
                },
                score: {
                    type: 'number',
                },
            },
        },
    })
    listOfEvaluators: {
        companyName: Company['name'];
        siteName: Site['name'];
        siteContact: Site['contact'];
        personInCharge: Site['personInCharge'];
        score: TeamEvaluationByCompany['score'];
    }[];
}
