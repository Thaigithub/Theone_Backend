import { ApiProperty } from '@nestjs/swagger';
import { City, District, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class SiteResponse {
    @ApiProperty({ type: 'number' })
    id: Site['id'];

    @ApiProperty({ type: 'string' })
    name: Site['name'];

    @ApiProperty({ type: 'string' })
    personInCharge: Site['personInCharge'];

    @ApiProperty({ type: 'string' })
    personInChargeContact: Site['personInChargeContact'];

    @ApiProperty({ type: 'string' })
    originalBuilding: Site['originalBuilding'];

    @ApiProperty({ type: 'string' })
    startDate: Site['startDate'];

    @ApiProperty({ type: 'string' })
    endDate: Site['endDate'];

    @ApiProperty({ type: 'string' })
    cityKoreanName: City['koreanName'];

    @ApiProperty({ type: 'string' })
    cityEnglishName: City['englishName'];

    @ApiProperty({ type: 'string' })
    districtKoreanName: District['koreanName'];

    @ApiProperty({ type: 'string' })
    districtEnglishName: District['englishName'];
}

export class SiteCompanyGetListResponse extends PaginationResponse<SiteResponse> {}
