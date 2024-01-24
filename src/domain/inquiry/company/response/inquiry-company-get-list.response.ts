import { Inquiry } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class InquiryResponse {
    id: Inquiry['id'];
    title: Inquiry['questionTitle'];
    status: Inquiry['status'];
    createdAt: Inquiry['createdAt'];
    file: FileResponse;
}

export class InquiryCompanyGetListResponse extends PaginationResponse<InquiryResponse> {}
