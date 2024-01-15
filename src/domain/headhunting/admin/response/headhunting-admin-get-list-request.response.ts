import { RequestStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class HeadhuntingAdminGetItemRequestResponse {
    id: number;
    companyName: string;
    siteName: string;
    postName: string;
    object: string;
    status: RequestStatus;
    date: Date;
}

export class HeadhuntingAdminGetListRequestResponse extends PaginationResponse<HeadhuntingAdminGetItemRequestResponse> {}
