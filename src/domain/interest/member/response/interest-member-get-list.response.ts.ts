import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class InterestMemberGetSite {
    id: number;
    name: string;
    address: string;
    countPost: number;
    logo: FileResponse;
}

class InterestMemberGetPost {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    codeName: string;
    siteName: string;
    logo: FileResponse;
}

export class InterestMemberGetResponse {
    id: number;
    site: InterestMemberGetSite;
    post: InterestMemberGetPost;
}

export class InterestMemberGetListResponse extends PaginationResponse<InterestMemberGetResponse> {}
