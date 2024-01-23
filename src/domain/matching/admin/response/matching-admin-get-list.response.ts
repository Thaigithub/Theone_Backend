import { PaginationResponse } from 'utils/generics/pagination.response';

export class MatchingAdminGetItemResponse {
    companyId: number;
    companyName: string;
    siteName: string;
    postName: string;
    numberOfInterviewRequests: number;
    numberOfInterviewRejections: number;
    paymentDate: Date;
    startDate: Date;
    endDate: Date;
    remainingNumber: string;
}

export class MatchingAdminGetListResponse extends PaginationResponse<MatchingAdminGetItemResponse> {}
