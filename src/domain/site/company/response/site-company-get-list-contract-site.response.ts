import { ApiProperty } from '@nestjs/swagger';
import { Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class GetListForContract {
    @ApiProperty({ type: Number })
    siteId: Site['id'];
    @ApiProperty({ type: String })
    siteName: Site['name'];
    @ApiProperty({ type: Date })
    startDate: Site['startDate'];
    @ApiProperty({ type: Date })
    endDate: Site['endDate'];
    @ApiProperty({ type: Number })
    numberOfContract: Site['numberOfContract'];
}
export class SiteCompanyGetListForContractResponse extends PaginationResponse<GetListForContract> {}
