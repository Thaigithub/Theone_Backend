import { City, District, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class SiteResponse {
    id: Site['id'];
    name: Site['name'];
    personInCharge: Site['personInCharge'];
    personInChargeContact: Site['personInChargeContact'];
    originalBuilding: Site['originalBuilding'];
    startDate: Site['startDate'];
    endDate: Site['endDate'];
    cityKoreanName: City['koreanName'];
    cityEnglishName: City['englishName'];
    districtKoreanName: District['koreanName'];
    districtEnglishName: District['englishName'];
}

export class SiteCompanyGetListResponse extends PaginationResponse<SiteResponse> {}
