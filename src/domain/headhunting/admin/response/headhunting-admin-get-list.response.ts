import { Headhunting, HeadhuntingPaymentStatus, Post, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListResponse {
    id: Headhunting['id'];
    siteName: Site['name'];
    postName: Post['name'];
    paymentStatus: HeadhuntingPaymentStatus;
    paymentDate: Date;
}

export class HeadhuntingAdminGetListResponse extends PaginationResponse<GetListResponse> {}
