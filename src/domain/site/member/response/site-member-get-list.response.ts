import { Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class SiteResponse {
    id: number;
    name: string;
    startDate: Site['startDate'];
    endDate: Site['endDate'];
    numberOfWorkers: number;
    interestId: number;
    longitude: Site['longitude'];
    latitude: Site['latitude'];
}

export class SiteMemberGetListResponse extends PaginationResponse<SiteResponse> {}
