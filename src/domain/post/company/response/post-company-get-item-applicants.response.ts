import { ApiProperty } from '@nestjs/swagger';
import { PostCompanyGetItemListResponse } from './post-company-get-item-list.response';

export class PostCompanyGetItemApplicantsResponse extends PostCompanyGetItemListResponse {
    @ApiProperty({ example: 1 })
    teamCount: number;

    @ApiProperty({ example: 2 })
    memberCount: number;
}
