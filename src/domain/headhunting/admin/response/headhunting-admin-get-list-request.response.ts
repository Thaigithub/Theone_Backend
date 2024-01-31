import { Company, HeadhuntingRequest, Post, HeadhuntingRequestStatus, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class HeadhuntingAdminGetItemRequestResponse {
    id: HeadhuntingRequest['id'];
    companyName: Company['name'];
    siteName: Site['name'];
    postName: Post['name'];
    status: HeadhuntingRequestStatus;
    date: Date;
}

export class HeadhuntingAdminGetListRequestResponse extends PaginationResponse<HeadhuntingAdminGetItemRequestResponse> {}
