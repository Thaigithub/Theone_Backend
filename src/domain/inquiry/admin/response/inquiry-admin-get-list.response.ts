import { Inquiry } from '@prisma/client';

import { PaginationResponse } from 'utils/generics/pagination.response';

class Inquirer {
    type: Inquiry['inquirerType'];
    name: string;
}

class InquiryResponse {
    id: Inquiry['id'];
    inquirer: Inquirer;
    inquiryType: Inquiry['inquiryType'];
    title: Inquiry['questionTitle'];
    status: Inquiry['status'];
    createdAt: Inquiry['createdAt'];
}

export class InquiryAdminGetListResponse extends PaginationResponse<InquiryResponse> {}
