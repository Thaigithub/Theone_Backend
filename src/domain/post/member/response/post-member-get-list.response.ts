import { ApiProperty } from '@nestjs/swagger';
import { Code, Post, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class OccupationResponse {
    @ApiProperty({ type: 'number' })
    id: Code['id'];

    @ApiProperty({ type: 'string' })
    codeName: Code['codeName'];
}

export class ConstructionMachinaryResponse {
    @ApiProperty({ type: 'number' })
    id: Code['id'];

    @ApiProperty({ type: 'string' })
    codeName: Code['codeName'];
}

export class PostResponse {
    @ApiProperty({ type: 'number' })
    id: Post['id'];

    @ApiProperty({ type: 'string' })
    name: Post['name'];

    @ApiProperty({ type: 'string' })
    occupation: Code['codeName'];

    @ApiProperty({ type: 'string' })
    siteAddress: Site['address'];

    @ApiProperty({ type: 'string' })
    siteAddressCity: Site['addressCity'];

    @ApiProperty({ type: 'string' })
    siteAddressDistrict: Site['addressDistrict'];

    @ApiProperty({ type: Date })
    endDate: Post['endDate'];
}

export class PostMemberGetListResponse extends PaginationResponse<PostResponse> {}
