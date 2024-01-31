import { HeadhuntingRequest, Post, PostStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class HeadhuntingCompanyResponse {
    name: string;
    status: PostStatus;
    startDate: Post['startDate'];
    endDate: Post['endDate'];
    site: {
        name: string;
    };
    headhuntingRequest: {
        date: HeadhuntingRequest['date'];
        status: HeadhuntingRequest['status'];
    };
}

export class HeadhuntingCompanyGetListResponse extends PaginationResponse<HeadhuntingCompanyResponse> {}
