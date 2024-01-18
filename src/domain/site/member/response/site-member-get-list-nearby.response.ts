import { Site } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class SiteNearByResponse {
    id: Site['id'];
    name: Site['name'];
    dictrict: {
        koreanName: string;
        englishName: string;
    };
    city: {
        koreanName: string;
        englishName: string;
    };
    file: FileResponse;
    posts: {
        id: number;
        name: string;
        isPulledUp: boolean;
        endDate: Date;
        occupationName: string;
    }[];
    isInterested: boolean;
    status: Site['status'];
    longitude: Site['longitude'];
    latitude: Site['latitude'];
    startDate: Date;
    endDate: Date;
}

export class SiteMemberNearByGetListResponse {
    data: SiteNearByResponse[];
}
