import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class MatchingMemberGetItemResponse {
    id: number;
    postName: string;
    sitename: string;
    location: string;
    deadline: string;
    occupation: string;
    logo: FileResponse;
    isInterested: boolean;
    isRefuse: boolean;
    isApplication: boolean;
}
export class MatchingMemberGetListResponse extends PaginationResponse<MatchingMemberGetItemResponse> {}
