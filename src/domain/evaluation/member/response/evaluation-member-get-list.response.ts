import { ApiProperty } from '@nestjs/swagger';
import { Contract, Site, SiteEvaluationByContract } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class SiteEvaluationByContractResponse {
    @ApiProperty({ type: 'number' })
    id: SiteEvaluationByContract['id'];

    @ApiProperty({ type: 'string' })
    siteName: Site['name'];

    @ApiProperty({ type: 'string' })
    startWorkDate: Contract['startDate'];

    @ApiProperty({ type: 'string' })
    endWorkDate: Contract['endDate'];

    @ApiProperty({
        type: 'number',
        description: "If score value is null, it means member didn't evaluate that site yet",
    })
    score: SiteEvaluationByContract['score'];

    @ApiProperty({
        type: 'object',
        properties: {
            fileName: {
                type: 'string',
            },
            fileType: {
                type: 'string',
            },
            fileKey: {
                type: 'string',
            },
        },
    })
    logo: FileResponse;
}

export class EvaluationMemberGetListResponse extends PaginationResponse<SiteEvaluationByContractResponse> {}
