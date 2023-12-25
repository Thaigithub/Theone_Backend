import { ApiProperty } from '@nestjs/swagger';
import { City, Code, District, Post, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

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
    siteAddressCity: City['englishName'];

    @ApiProperty({ type: 'string' })
    siteAddressDistrict: District['englishName'];

    @ApiProperty({ type: 'string', format: 'date' })
    startWorkDate: string;

    @ApiProperty({ type: 'string', format: 'date' })
    endWorkDate: string;

    @ApiProperty({ type: 'number' })
    numberOfPeople: Post['numberOfPeople'];

    @ApiProperty({ type: 'string', format: 'date' })
    endDate: string;
}

export class PostMemberGetListResponse extends PaginationResponse<PostResponse> {}
