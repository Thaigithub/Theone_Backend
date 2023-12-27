import { ApiProperty } from '@nestjs/swagger';
import { Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class SiteResponse {
    @ApiProperty({ type: 'number' })
    id: Site['id'];

    @ApiProperty({ type: 'string' })
    name: Site['name'];

    @ApiProperty({ type: 'string' })
    personInCharge: Site['personInCharge'];

    @ApiProperty({ type: 'string' })
    startDate: Site['startDate'];

    @ApiProperty({ type: 'string' })
    endDate: Site['endDate'];
}

export class SiteCompanyGetListResponse extends PaginationResponse<SiteResponse> {}
