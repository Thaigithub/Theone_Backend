import { ApiProperty } from '@nestjs/swagger';
import { Company, Member, Site, Team, TeamEvaluation, TeamEvaluationByCompany } from '@prisma/client';

export class TeamEvaluationAdminGetDetailResponse {
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
