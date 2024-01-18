import { City, District, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class SiteResponse {
    id: number;
    name: string;
    startDate: Site['startDate'];
    endDate: Site['endDate'];
    numberOfWorkers: number;
    isInterested: boolean;
    longitude: Site['longitude'];
    latitude: Site['latitude'];
    district: {
        koreanName: District['koreanName'];
        englishName: District['englishName'];
    };
    city: {
        koreanName: City['koreanName'];
        englishName: City['englishName'];
    };
}

export class SiteMemberGetListResponse extends PaginationResponse<SiteResponse> {}
