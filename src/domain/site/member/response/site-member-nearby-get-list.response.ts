import { SiteStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class SiteNearByResponse {
    id: number;
    name: string;
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
    }[];
    interestId: number;
    status: SiteStatus;
}

export class SiteMemberNearByGetListResponse extends PaginationResponse<SiteNearByResponse> {}
