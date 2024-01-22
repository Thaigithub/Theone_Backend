import { Inquiry } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class InquiryResponse {
    id: Inquiry['id'];
    title: Inquiry['questionTitle'];
    status: Inquiry['status'];
    createdAt: Inquiry['createdAt'];
}

export class InquiryCompanyGetListResponse extends PaginationResponse<InquiryResponse> {}
