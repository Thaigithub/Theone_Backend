import { ApiProperty } from '@nestjs/swagger';
import { Contract, Site, SiteEvaluationByContract } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class SiteEvaluationByContractResponse {
    @ApiProperty({ type: 'number' })
    public id: SiteEvaluationByContract['id'];

    @ApiProperty({ type: 'string' })
    public siteName: Site['name'];

    @ApiProperty({ type: 'string' })
    public startWorkDate: Contract['startDate'];

    @ApiProperty({ type: 'string' })
    public endWorkDate: Contract['endDate'];

    @ApiProperty({
        type: 'number',
        description: "If score value is null, it means member didn't evaluate that site yet",
    })
    public score: SiteEvaluationByContract['score'];

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
    public logo: FileResponse;
}

export class EvaluationMemberGetListResponse extends PaginationResponse<SiteEvaluationByContractResponse> {}
