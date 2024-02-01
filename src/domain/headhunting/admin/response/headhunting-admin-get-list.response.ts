import { Headhunting, HeadhuntingPaymentStatus, HeadhuntingRequest, Post, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListResponse {
    id: Headhunting['id'];
    siteName: Site['name'];
    postName: Post['name'];
    paymentStatus: HeadhuntingPaymentStatus;
    paymentDate: Date;
    requestId: HeadhuntingRequest['id'];
}

export class HeadhuntingAdminGetListResponse extends PaginationResponse<GetListResponse> {}
