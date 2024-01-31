import { Region } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class RegionGetResponse {
    id: Region['id'];
    districtKoreanName: Region['districtKoreanName'];
    districtEnglishName: Region['districtEnglishName'];
    cityKoreanName: Region['cityKoreanName'];
    cityEnglishName: Region['cityEnglishName'];
}

export class RegionGetListResponse extends PaginationResponse<RegionGetResponse> {}
